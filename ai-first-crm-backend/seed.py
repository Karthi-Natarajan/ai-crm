import random
from database import get_db, init_db

init_db()

NAMES = [
    "Karthi", "Anu", "Sri", "David", "Emily", "Marcus",
    "Sarah", "Lisa", "John", "Alex", "Ravi", "Priya"
]

COMPANIES = [
    "ABC", "GreenScale", "TechFlow", "DataVault",
    "FinBridge", "MediCore", "BuildRight"
]

ROLES = ["Manager", "Founder", "Data Engineer", "CTO", "Sales Head"]
INDUSTRIES = ["SaaS", "AI", "FinTech", "HealthTech", "EdTech"]
STATUSES = ["Hot", "Warm", "Cold"]

def seed_leads(count=50):
    db = get_db()

    for _ in range(count):
        name = random.choice(NAMES)
        company = random.choice(COMPANIES)
        role = random.choice(ROLES)
        industry = random.choice(INDUSTRIES)
        status = random.choice(STATUSES)

        cur = db.execute("""
            INSERT INTO leads (name, company, role, email, industry, status, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            name,
            company,
            role,
            f"{name.lower()}@{company.lower()}.com",
            industry,
            status,
            "Auto-generated demo lead"
        ))

        lead_id = cur.lastrowid

        db.execute("""
            INSERT INTO activity_logs (type, title, description)
            VALUES (?, ?, ?)
        """, (
            "lead",
            "New lead added",
            f"{name} from {company} was added to the pipeline."
        ))

    db.commit()
    db.close()
    print(f"✅ Seeded {count} leads successfully")

if __name__ == "__main__":
    seed_leads(50)   