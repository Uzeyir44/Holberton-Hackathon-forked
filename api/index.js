const DEMO_CONVERSATIONS = [
  { id: 1, initials: "LA", avatar: "", customer: "Lara Accessories", channel: "Instagram DM", time: "2m", status: "Hot", urgent: false, preview: "Can I get 2 black hoodies for 80 AZN?", messages: [["incoming", "Hi, do you have black hoodies? I need 2 pieces."], ["outgoing", "Hi, yes. Please send the sizes and delivery address."], ["incoming", "M and L sizes. 2 black hoodies for 80 AZN, delivery to Nizami."]], sale: { product: "Black hoodie", quantity: 2, revenue: 80 } },
  { id: 2, initials: "NM", avatar: "green", customer: "Nigar M.", channel: "WhatsApp", time: "34m", status: "Unanswered", urgent: true, preview: "Do you still have silver earrings in stock?", messages: [["incoming", "Do you still have silver earrings in stock?"], ["incoming", "I need 3 pairs today if possible."]], sale: { product: "Silver earrings", quantity: 3, revenue: 105 } },
  { id: 3, initials: "EM", avatar: "blue", customer: "Elmir Boutique", channel: "Telegram", time: "48m", status: "", urgent: false, preview: "Need 5 gift boxes by tomorrow morning.", messages: [["incoming", "Need 5 gift boxes by tomorrow morning."], ["outgoing", "We have matte black and rose gift boxes available."]], sale: { product: "Gift box", quantity: 5, revenue: 50 } },
  { id: 4, initials: "SA", avatar: "pink", customer: "Sabina Aliyeva", channel: "Instagram DM", time: "1h", status: "", urgent: false, preview: "Please send price for rose lip gloss set.", messages: [["incoming", "Please send price for rose lip gloss set."], ["outgoing", "The rose lip gloss set is 32 AZN and delivery is available today."]], sale: { product: "Lip gloss set", quantity: 1, revenue: 32 } },
];

const DEMO_PRODUCTS = [
  { name: "Black hoodie", requests: 42, sales: 31, revenue: 1240, stock: 18, trend: "High demand" },
  { name: "Silver earrings", requests: 31, sales: 22, revenue: 770, stock: 6, trend: "Restock soon" },
  { name: "Lip gloss set", requests: 24, sales: 19, revenue: 608, stock: 14, trend: "Growing" },
  { name: "Gift box", requests: 18, sales: 12, revenue: 240, stock: 40, trend: "Seasonal" },
];

const DEMO_TEAM = [
  { name: "Aysel", role: "Owner", conversations: 86, reply: "5m", status: "Online" },
  { name: "Murad", role: "Sales assistant", conversations: 54, reply: "9m", status: "Online" },
  { name: "Leyla", role: "Support", conversations: 39, reply: "14m", status: "Away" },
];

const DEMO_PLANS = [
  { name: "Starter", price: "29 AZN", current: true, features: ["3 channels", "2 team members", "AI summaries"] },
  { name: "Growth", price: "59 AZN", current: false, features: ["6 channels", "6 team members", "Product demand AI"] },
  { name: "Pro", price: "99 AZN", current: false, features: ["Unlimited channels", "Advanced analytics", "Priority support"] },
];

const DEMO_CHANNELS = [
  { name: "Instagram", key: "instagram", count: 128 },
  { name: "WhatsApp", key: "whatsapp", count: 64 },
  { name: "Telegram", key: "telegram", count: 37 },
];

function getMetrics(productCount, urgentCount, channelCount, userCount) {
  return {
    estimated_sales: 4820,
    sales_change: "+18% from last week",
    avg_reply_time: `${Math.max(1, 7)}m ${Math.floor(Math.random() * 60)}s`,
    urgent_count: urgentCount || 1,
    top_product: "Black hoodie",
    top_product_requests: 42,
    active_subscribers: 225 + (userCount || 0),
    channel_count: channelCount || 3,
    backend_revision: 0,
    last_synced: new Date().toLocaleTimeString("en-GB", { hour12: false }),
  };
}

export default async function handler(req, res) {
  const url = new URL(req.url || "/", "http://localhost");
  const path = url.pathname;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (path === "/api/bootstrap" && req.method === "GET") {
      return res.json({
        conversations: DEMO_CONVERSATIONS,
        products: DEMO_PRODUCTS,
        team: DEMO_TEAM,
        plans: DEMO_PLANS,
        metrics: getMetrics(DEMO_PRODUCTS.length, DEMO_CONVERSATIONS.filter(c => c.urgent).length, DEMO_CHANNELS.length, DEMO_TEAM.length),
        channels: DEMO_CHANNELS,
      });
    }

    if (path === "/api/metrics" && req.method === "GET") {
      return res.json(getMetrics(DEMO_PRODUCTS.length, DEMO_CONVERSATIONS.filter(c => c.urgent).length, DEMO_CHANNELS.length, DEMO_TEAM.length));
    }

    if (path === "/api/channels" && req.method === "GET") {
      return res.json(DEMO_CHANNELS);
    }

    if (path === "/api/summary" && req.method === "GET") {
      return res.json({
        estimated_revenue: "4,820 AZN",
        most_requested: "Black hoodie",
        needs_reply: DEMO_CONVERSATIONS.filter(c => c.urgent).length,
        recommendation: "Restock silver earrings, assign WhatsApp replies after 18:00, and follow up with hoodie buyers tomorrow morning.",
      });
    }

    if (path === "/api/notifications" && req.method === "GET") {
      return res.json({
        message: `${DEMO_CONVERSATIONS.filter(c => c.urgent).length} unanswered chats and 1 stock warning`,
        urgent_count: DEMO_CONVERSATIONS.filter(c => c.urgent).length,
        low_stock: ["Silver earrings"],
      });
    }

    if (path === "/api/products" && req.method === "GET") {
      return res.json({ products: DEMO_PRODUCTS });
    }

    if (path === "/api/products" && req.method === "POST") {
      const body = typeof req.body === "object" ? req.body : {};
      const newProduct = {
        name: body.name || "New Product",
        requests: Number(body.requests || 0),
        sales: Number(body.sales || 0),
        revenue: Number(body.revenue || 0),
        stock: Number(body.stock || 0),
        trend: body.trend || "Manual",
      };
      DEMO_PRODUCTS.push(newProduct);
      return res.status(201).json({ created: true, product: newProduct, metrics: getMetrics() });
    }

    if (path.startsWith("/api/conversations/") && path.endsWith("/reply") && req.method === "POST") {
      const convId = parseInt(path.split("/")[3], 10);
      const conv = DEMO_CONVERSATIONS.find(c => c.id === convId);
      if (!conv) return res.status(404).json({ error: "Conversation not found" });

      const body = typeof req.body === "object" ? req.body : {};
      const text = body.text || "Sure, I can reserve them for you.";
      conv.messages.push(["outgoing", text]);
      conv.messages.push(["incoming", `Backend customer reply: Thanks, I received your message. Please reserve it for me.`]);
      conv.preview = conv.messages[conv.messages.length - 1][1];
      conv.urgent = true;
      conv.status = "Unanswered";

      return res.json({
        conversation_id: String(conv.id),
        message: ["outgoing", text],
        auto_reply: ["incoming", "Backend customer reply: Thanks, I received your message. Please reserve it for me."],
        status: "Customer replied",
        preview: conv.preview,
        conversation: conv,
        backend_processed: true,
        metrics: getMetrics(),
        channels: DEMO_CHANNELS,
      });
    }

    if (path.startsWith("/api/conversations/") && path.endsWith("/priority") && req.method === "POST") {
      const convId = parseInt(path.split("/")[3], 10);
      const conv = DEMO_CONVERSATIONS.find(c => c.id === convId);
      if (!conv) return res.status(404).json({ error: "Conversation not found" });
      conv.urgent = true;
      conv.status = "Priority";
      return res.json({ conversation_id: String(convId), status: "Priority", message: "Conversation marked as priority" });
    }

    if (path === "/api/conversations/assign-urgent" && req.method === "POST") {
      let count = 0;
      for (const conv of DEMO_CONVERSATIONS) {
        if (conv.urgent) { conv.urgent = false; conv.status = "Assigned"; count++; }
      }
      return res.json({ assigned: count, message: `${count} urgent conversations assigned`, metrics: getMetrics() });
    }

    if (path === "/api/team/invite" && req.method === "POST") {
      const member = { name: "New teammate", role: "Sales assistant", conversations: 0, reply: "-", status: "Invited" };
      DEMO_TEAM.push(member);
      return res.status(201).json({ invited: true, member, metrics: getMetrics() });
    }

    if (path.startsWith("/api/team/") && path.endsWith("/permissions") && req.method === "POST") {
      const name = decodeURIComponent(path.split("/")[3]);
      const member = DEMO_TEAM.find(m => m.name.toLowerCase() === name.toLowerCase()) || DEMO_TEAM[0];
      const permissions = { can_reply: true, can_create_sales: member.role !== "Support", can_manage_billing: member.role === "Owner", can_invite_team: member.role === "Owner" };
      return res.json({ member, permissions, message: `${member.name} permissions loaded` });
    }

    if (path === "/api/billing/select" && req.method === "POST") {
      return res.json({ selected: true, plan: DEMO_PLANS[0], plans: DEMO_PLANS });
    }

    if (path === "/api/sales" && req.method === "POST") {
      return res.status(201).json({ created: true, sale: { product: "Demo", quantity: 1, revenue: 0 }, metrics: getMetrics() });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (err) {
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
