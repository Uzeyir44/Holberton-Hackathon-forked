from datetime import datetime

from flask import Flask, jsonify, render_template, request

app = Flask(__name__, template_folder="src", static_folder="src", static_url_path="")


@app.after_request
def add_development_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Accept"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return response


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


def log_action(message):
    print(f"[InboxPilot backend] {message}", flush=True)


def find_conversation(conversation_id):
    return next((item for item in CONVERSATIONS if item["id"] == conversation_id), None)


def backend_stamp():
    return datetime.now().strftime("%H:%M:%S")


@app.route("/")
def index():
    log_action("served frontend dashboard")
    return render_template("index.html")


@app.get("/api/bootstrap")
def bootstrap():
    log_action("sent bootstrap data to frontend")
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
    log_action("generated AI summary for frontend")
    return jsonify(
        {
            "estimated_revenue": "4,820 AZN",
            "most_requested": "Black hoodie",
            "needs_reply": urgent_count,
            "recommendation": "Restock silver earrings, assign WhatsApp replies after 18:00, and follow up with hoodie buyers tomorrow morning.",
        }
    )


@app.get("/api/notifications")
def notifications():
    urgent_count = len([item for item in CONVERSATIONS if item["urgent"]])
    low_stock = [item["name"] for item in PRODUCTS if item["stock"] <= 6]
    log_action(f"checked notifications: {urgent_count} urgent chats, {len(low_stock)} stock warnings")
    return jsonify(
        {
            "message": f"{urgent_count} unanswered chats and {len(low_stock)} stock warning",
            "urgent_count": urgent_count,
            "low_stock": low_stock,
        }
    )


@app.get("/api/conversations/<int:conversation_id>")
def get_conversation(conversation_id):
    conversation = find_conversation(conversation_id)

    if conversation is None:
        log_action(f"conversation fetch failed: conversation {conversation_id} not found")
        return jsonify({"error": "Conversation not found"}), 404

    log_action(f"sent conversation {conversation_id} to frontend")
    return jsonify({"conversation": conversation})


@app.post("/api/conversations/<int:conversation_id>/reply")
def create_reply(conversation_id):
    payload = request.get_json(silent=True) or {}
    text = payload.get("text", "").strip()
    conversation = find_conversation(conversation_id)

    if conversation is None:
        log_action(f"reply failed: conversation {conversation_id} not found")
        return jsonify({"error": "Conversation not found"}), 404

    if not text:
        log_action(f"reply rejected for conversation {conversation_id}: empty text")
        return jsonify({"error": "Reply text is required"}), 400

    auto_reply = (
        f"Backend customer reply at {backend_stamp()}: Thanks, I received your message about "
        f"{conversation['sale']['product']}. Please reserve it for me."
    )
    conversation["messages"].append(["outgoing", text])
    conversation["messages"].append(["incoming", auto_reply])
    conversation["urgent"] = True
    conversation["status"] = "Customer replied"
    conversation["preview"] = auto_reply
    log_action(f"processed reply for {conversation['customer']}: '{text}'")
    log_action(f"created sample customer reply for {conversation['customer']}: '{auto_reply}'")

    return jsonify(
        {
            "conversation_id": conversation_id,
            "message": ["outgoing", text],
            "auto_reply": ["incoming", auto_reply],
            "status": conversation["status"],
            "preview": auto_reply,
            "conversation": conversation,
            "backend_processed": True,
        }
    )


@app.post("/api/conversations/assign-urgent")
def assign_urgent():
    count = 0
    for conversation in CONVERSATIONS:
        if conversation["urgent"]:
            conversation["urgent"] = False
            conversation["status"] = "Assigned"
            count += 1

    log_action(f"assigned {count} urgent conversations to team")
    return jsonify({"assigned": count, "message": f"{count} urgent conversations assigned"})


@app.post("/api/conversations/<int:conversation_id>/priority")
def mark_priority(conversation_id):
    conversation = find_conversation(conversation_id)

    if conversation is None:
        log_action(f"priority failed: conversation {conversation_id} not found")
        return jsonify({"error": "Conversation not found"}), 404

    conversation["status"] = "Priority"
    log_action(f"marked {conversation['customer']} as priority")
    return jsonify({"conversation_id": conversation_id, "status": "Priority", "message": "Conversation marked as priority"})


@app.post("/api/sales")
def create_sale():
    payload = request.get_json(silent=True) or {}
    required_fields = {"product", "quantity", "revenue"}

    if not required_fields.issubset(payload):
        log_action("sale record rejected: incomplete payload")
        return jsonify({"error": "Product, quantity, and revenue are required"}), 400

    log_action(f"created sale record: {payload['quantity']} x {payload['product']} for {payload['revenue']} AZN")
    return jsonify({"created": True, "sale": payload}), 201


@app.post("/api/products")
def create_product():
    payload = request.get_json(silent=True) or {}
    name = payload.get("name", "").strip()

    if not name:
        log_action("product rejected: missing name")
        return jsonify({"error": "Product name is required"}), 400

    new_product = {
        "name": name,
        "requests": int(payload.get("requests") or 0),
        "sales": int(payload.get("sales") or 0),
        "revenue": int(payload.get("revenue") or 0),
        "stock": int(payload.get("stock") or 0),
        "trend": payload.get("trend", "Manual").strip() or "Manual",
    }
    PRODUCTS.append(new_product)
    log_action(f"created product from frontend form: {new_product['name']}")
    return jsonify({"created": True, "product": new_product}), 201


@app.post("/api/team/invite")
def invite_team_member():
    new_member = {"name": "New teammate", "role": "Sales assistant", "conversations": 0, "reply": "-", "status": "Invited"}
    TEAM.append(new_member)
    log_action("processed team invite")
    return jsonify({"invited": True, "member": new_member}), 201


@app.post("/api/team/<name>/permissions")
def team_permissions(name):
    member = next((item for item in TEAM if item["name"].lower() == name.lower()), None)

    if member is None:
        log_action(f"permissions failed: team member {name} not found")
        return jsonify({"error": "Team member not found"}), 404

    permissions = {
        "can_reply": True,
        "can_create_sales": member["role"] != "Support",
        "can_manage_billing": member["role"] == "Owner",
        "can_invite_team": member["role"] == "Owner",
    }
    log_action(f"sent permissions for team member: {name}")
    return jsonify({"member": member, "permissions": permissions, "message": f"{name} permissions loaded"})


@app.post("/api/billing/select")
def select_plan():
    payload = request.get_json(silent=True) or {}
    plan_name = payload.get("plan")
    selected_plan = next((plan for plan in PLANS if plan["name"] == plan_name), None)

    if selected_plan is None:
        log_action(f"billing plan rejected: {plan_name}")
        return jsonify({"error": "Plan not found"}), 404

    for plan in PLANS:
        plan["current"] = plan["name"] == plan_name

    log_action(f"selected billing plan: {plan_name}")
    return jsonify({"selected": True, "plan": selected_plan, "plans": PLANS})


if __name__ == "__main__":
    app.run(debug=True)
