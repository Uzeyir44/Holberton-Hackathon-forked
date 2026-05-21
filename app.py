from flask import Flask, jsonify, render_template, request

app = Flask(__name__, template_folder="src", static_folder="src", static_url_path="")


CONVERSATIONS = [
    {
        "id": 1,
        "initials": "LA",
        "avatar": "",
        "customer": "Lara Accessories",
        "channel": "Instagram DM",
        "time": "2m",
        "status": "Hot",
        "urgent": False,
        "preview": "Can I get 2 black hoodies for 80 AZN?",
        "messages": [
            ["incoming", "Hi, do you have black hoodies? I need 2 pieces."],
            ["outgoing", "Hi, yes. Please send the sizes and delivery address."],
            ["incoming", "M and L sizes. 2 black hoodies for 80 AZN, delivery to Nizami."],
        ],
        "sale": {"product": "Black hoodie", "quantity": 2, "revenue": 80},
    },
    {
        "id": 2,
        "initials": "NM",
        "avatar": "green",
        "customer": "Nigar M.",
        "channel": "WhatsApp",
        "time": "34m",
        "status": "Unanswered",
        "urgent": True,
        "preview": "Do you still have silver earrings in stock?",
        "messages": [
            ["incoming", "Do you still have silver earrings in stock?"],
            ["incoming", "I need 3 pairs today if possible."],
        ],
        "sale": {"product": "Silver earrings", "quantity": 3, "revenue": 105},
    },
    {
        "id": 3,
        "initials": "EM",
        "avatar": "blue",
        "customer": "Elmir Boutique",
        "channel": "Telegram",
        "time": "48m",
        "status": "",
        "urgent": False,
        "preview": "Need 5 gift boxes by tomorrow morning.",
        "messages": [
            ["incoming", "Need 5 gift boxes by tomorrow morning."],
            ["outgoing", "We have matte black and rose gift boxes available."],
        ],
        "sale": {"product": "Gift box", "quantity": 5, "revenue": 50},
    },
    {
        "id": 4,
        "initials": "SA",
        "avatar": "pink",
        "customer": "Sabina Aliyeva",
        "channel": "Instagram DM",
        "time": "1h",
        "status": "",
        "urgent": False,
        "preview": "Please send price for rose lip gloss set.",
        "messages": [
            ["incoming", "Please send price for rose lip gloss set."],
            ["outgoing", "The rose lip gloss set is 32 AZN and delivery is available today."],
        ],
        "sale": {"product": "Lip gloss set", "quantity": 1, "revenue": 32},
    },
]

PRODUCTS = [
    {"name": "Black hoodie", "requests": 42, "sales": 31, "revenue": 1240, "stock": 18, "trend": "High demand"},
    {"name": "Silver earrings", "requests": 31, "sales": 22, "revenue": 770, "stock": 6, "trend": "Restock soon"},
    {"name": "Lip gloss set", "requests": 24, "sales": 19, "revenue": 608, "stock": 14, "trend": "Growing"},
    {"name": "Gift box", "requests": 18, "sales": 12, "revenue": 240, "stock": 40, "trend": "Seasonal"},
]

TEAM = [
    {"name": "Aysel", "role": "Owner", "conversations": 86, "reply": "5m", "status": "Online"},
    {"name": "Murad", "role": "Sales assistant", "conversations": 54, "reply": "9m", "status": "Online"},
    {"name": "Leyla", "role": "Support", "conversations": 39, "reply": "14m", "status": "Away"},
]

PLANS = [
    {"name": "Starter", "price": "29 AZN", "current": True, "features": ["3 channels", "2 team members", "AI summaries"]},
    {"name": "Growth", "price": "59 AZN", "current": False, "features": ["6 channels", "6 team members", "Product demand AI"]},
    {"name": "Pro", "price": "99 AZN", "current": False, "features": ["Unlimited channels", "Advanced analytics", "Priority support"]},
]


@app.route("/")
def index():
    return render_template("index.html")


@app.get("/api/bootstrap")
def bootstrap():
    return jsonify(
        {
            "conversations": CONVERSATIONS,
            "products": PRODUCTS,
            "team": TEAM,
            "plans": PLANS,
        }
    )


@app.get("/api/summary")
def summary():
    urgent_count = len([item for item in CONVERSATIONS if item["urgent"]])
    return jsonify(
        {
            "estimated_revenue": "4,820 AZN",
            "most_requested": "Black hoodie",
            "needs_reply": urgent_count,
            "recommendation": "Restock silver earrings, assign WhatsApp replies after 18:00, and follow up with hoodie buyers tomorrow morning.",
        }
    )


@app.post("/api/conversations/<int:conversation_id>/reply")
def create_reply(conversation_id):
    payload = request.get_json(silent=True) or {}
    text = payload.get("text", "").strip()

    if not text:
        return jsonify({"error": "Reply text is required"}), 400

    return jsonify(
        {
            "conversation_id": conversation_id,
            "message": ["outgoing", text],
            "status": "Replied",
        }
    )


@app.post("/api/sales")
def create_sale():
    payload = request.get_json(silent=True) or {}
    required_fields = {"product", "quantity", "revenue"}

    if not required_fields.issubset(payload):
        return jsonify({"error": "Product, quantity, and revenue are required"}), 400

    return jsonify({"created": True, "sale": payload}), 201


if __name__ == "__main__":
    app.run(debug=True)
