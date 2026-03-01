def generate_ai_insight(lead):
    score = 0
    signals = []

    if lead["status"] == "Hot":
        score += 35
        signals.append("High intent lead")

    if lead["industry"] in ["SaaS", "AI", "Artificial Intelligence", "FinTech"]:
        score += 25
        signals.append("High-growth industry")

    if lead["role"] and any(r in lead["role"] for r in ["Manager", "Lead", "Head"]):
        score += 20
        signals.append("Decision-maker role")

    if lead["email"]:
        score += 10
        signals.append("Valid contact available")

    if lead["notes"]:
        score += 10
        signals.append("Manual context provided")

    recommendation = (
        "Immediate follow-up recommended"
        if score >= 70
        else "Nurture with emails and insights"
    )

    insight = f"""
Lead Score: {score}/100

Key Signals:
- {" | ".join(signals)}

Recommended Action:
{recommendation}
""".strip()

    return insight, score