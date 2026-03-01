from flask import Blueprint, request, jsonify
from database import get_db, init_db
from ai_service import generate_ai_insight
from datetime import datetime, timedelta

api = Blueprint("api", __name__)
init_db()

# ------------------------
# LEADS
# ------------------------
@api.route("/leads", methods=["GET"])
def get_leads():
    db = get_db()
    rows = db.execute("SELECT * FROM leads ORDER BY id DESC").fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])


@api.route("/leads", methods=["POST"])
def create_lead():
    data = request.json
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        INSERT INTO leads (name, company, role, email, industry, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (
        data["name"],
        data.get("company"),
        data.get("role"),
        data.get("email"),
        data.get("industry"),
        data.get("status"),
        data.get("notes"),
    ))

    db.commit()
    lead_id = cur.lastrowid
    lead = db.execute("SELECT * FROM leads WHERE id=?", (lead_id,)).fetchone()
    db.close()

    return jsonify(dict(lead)), 201


@api.route("/leads/<int:lead_id>", methods=["DELETE"])
def delete_lead(lead_id):
    db = get_db()
    cur = db.cursor()
    cur.execute("DELETE FROM leads WHERE id=?", (lead_id,))
    db.commit()
    success = cur.rowcount > 0
    db.close()
    return jsonify({"success": success})


# ------------------------
# DASHBOARD KPIs
# ------------------------
@api.route("/dashboard", methods=["GET"])
def dashboard():
    db = get_db()

    data = {
        "totalLeads": db.execute("SELECT COUNT(*) FROM leads").fetchone()[0],
        "hot": db.execute("SELECT COUNT(*) FROM leads WHERE status='Hot'").fetchone()[0],
        "warm": db.execute("SELECT COUNT(*) FROM leads WHERE status='Warm'").fetchone()[0],
        "cold": db.execute("SELECT COUNT(*) FROM leads WHERE status='Cold'").fetchone()[0],
        "industries": db.execute("SELECT COUNT(DISTINCT industry) FROM leads").fetchone()[0],
    }

    db.close()
    return jsonify(data)


# ------------------------
# DASHBOARD CHARTS (REAL DATA)
# ------------------------
@api.route("/dashboard/charts", methods=["GET"])
def dashboard_charts():
    db = get_db()

    status = db.execute("""
        SELECT status as name, COUNT(*) as value
        FROM leads
        GROUP BY status
    """).fetchall()

    last_7_days = []
    for i in range(6, -1, -1):
        day = datetime.now() - timedelta(days=i)
        count = db.execute("""
            SELECT COUNT(*) FROM leads
            WHERE DATE(created_at) = DATE(?)
        """, (day.date(),)).fetchone()[0]

        last_7_days.append({
            "day": day.strftime("%a"),
            "leads": count
        })

    db.close()

    return jsonify({
        "weekly": last_7_days,
        "status": [dict(s) for s in status]
    })


# ------------------------
# AI INSIGHTS
# ------------------------
@api.route("/ai-insights/<int:lead_id>", methods=["POST"])
def generate_insight(lead_id):
    db = get_db()
    lead = db.execute("SELECT * FROM leads WHERE id=?", (lead_id,)).fetchone()

    if not lead:
        db.close()
        return jsonify({"error": "Lead not found"}), 404

    insight, score = generate_ai_insight(dict(lead))

    db.execute("""
        INSERT INTO ai_insights (lead_id, insight, score)
        VALUES (?, ?, ?)
    """, (lead_id, insight, score))
    db.commit()
    db.close()

    return jsonify({"leadId": lead_id, "score": score, "insight": insight})


@api.route("/ai-insights/<int:lead_id>", methods=["GET"])
def get_insights(lead_id):
    db = get_db()
    rows = db.execute("""
        SELECT * FROM ai_insights
        WHERE lead_id=?
        ORDER BY created_at DESC
    """, (lead_id,)).fetchall()
    db.close()

    return jsonify([dict(r) for r in rows])
# ------------------------
# ANALYTICS
# ------------------------
@api.route("/analytics", methods=["GET"])
def analytics():
    db = get_db()

    leads = db.execute("""
        SELECT 
            strftime('%Y-%m', created_at) as month,
            COUNT(*) as total,
            SUM(CASE WHEN status='Hot' THEN 1 ELSE 0 END) as hot
        FROM leads
        GROUP BY month
        ORDER BY month
    """).fetchall()

    leads_vs_conversions = []
    conversion_rate = []
    revenue_pipeline = []

    for row in leads:
        month = row["month"]
        total = row["total"]
        hot = row["hot"] or 0

        rate = round((hot / total) * 100, 2) if total else 0

        leads_vs_conversions.append({
            "month": month,
            "leads": total,
            "conversions": hot
        })

        conversion_rate.append({
            "month": month,
            "rate": rate
        })

        # revenue estimation
        revenue = db.execute("""
            SELECT
                SUM(
                    CASE 
                        WHEN status='Hot' THEN 50000
                        WHEN status='Warm' THEN 25000
                        ELSE 10000
                    END
                ) as revenue
            FROM leads
            WHERE strftime('%Y-%m', created_at) = ?
        """, (month,)).fetchone()["revenue"] or 0

        revenue_pipeline.append({
            "month": month,
            "revenue": revenue
        })

    return jsonify({
        "leadsVsConversions": leads_vs_conversions,
        "conversionRate": conversion_rate,
        "revenuePipeline": revenue_pipeline
    })
# ------------------------
# ACTIVITY
# ------------------------
@api.route("/activities", methods=["GET"])
def get_activities():
    db = get_db()
    rows = db.execute("""
        SELECT *
        FROM activity_logs
        ORDER BY created_at DESC
        LIMIT 20
    """).fetchall()
    db.close()

    return jsonify([dict(r) for r in rows])