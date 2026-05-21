const icons = {
  inbox:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z"/></svg>',
  alert:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  chart:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
  products:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  team:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  billing:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h2"/><path d="M11 15h4"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
  bell:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10.27 21a2 2 0 0 0 3.46 0"/><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/></svg>',
  spark:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3-1.9 5.8L4 11l6.1 2.2L12 19l1.9-5.8L20 11l-6.1-2.2Z"/><path d="M5 3v4"/><path d="M3 5h4"/><path d="M19 17v4"/><path d="M17 19h4"/></svg>',
  money:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01"/><path d="M18 12h.01"/></svg>',
  clock:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  bag:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  users:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  more:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
  paperclip:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>',
  send:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  plus:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14"/><path d="M5 12h14"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m20 6-11 11-5-5"/></svg>',
};

const state = {
  page: window.location.hash.replace("#", "") || "inbox",
  filter: "All",
  selectedId: 1,
  query: "",
  saleRecords: [],
  notificationsOpen: false,
};

const API_BASE = window.location.protocol === "file:" ? "http://127.0.0.1:5000" : "";

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

let conversations = [
  {
    id: 1,
    initials: "LA",
    avatar: "",
    customer: "Lara Accessories",
    channel: "Instagram DM",
    time: "2m",
    status: "Hot",
    urgent: false,
    preview: "Can I get 2 black hoodies for 80 AZN?",
    messages: [
      ["incoming", "Hi, do you have black hoodies? I need 2 pieces."],
      ["outgoing", "Hi, yes. Please send the sizes and delivery address."],
      ["incoming", "M and L sizes. 2 black hoodies for 80 AZN, delivery to Nizami."],
    ],
    sale: { product: "Black hoodie", quantity: 2, revenue: 80 },
  },
  {
    id: 2,
    initials: "NM",
    avatar: "green",
    customer: "Nigar M.",
    channel: "WhatsApp",
    time: "34m",
    status: "Unanswered",
    urgent: true,
    preview: "Do you still have silver earrings in stock?",
    messages: [
      ["incoming", "Do you still have silver earrings in stock?"],
      ["incoming", "I need 3 pairs today if possible."],
    ],
    sale: { product: "Silver earrings", quantity: 3, revenue: 105 },
  },
  {
    id: 3,
    initials: "EM",
    avatar: "blue",
    customer: "Elmir Boutique",
    channel: "Telegram",
    time: "48m",
    status: "",
    urgent: false,
    preview: "Need 5 gift boxes by tomorrow morning.",
    messages: [
      ["incoming", "Need 5 gift boxes by tomorrow morning."],
      ["outgoing", "We have matte black and rose gift boxes available."],
    ],
    sale: { product: "Gift box", quantity: 5, revenue: 50 },
  },
  {
    id: 4,
    initials: "SA",
    avatar: "pink",
    customer: "Sabina Aliyeva",
    channel: "Instagram DM",
    time: "1h",
    status: "",
    urgent: false,
    preview: "Please send price for rose lip gloss set.",
    messages: [
      ["incoming", "Please send price for rose lip gloss set."],
      ["outgoing", "The rose lip gloss set is 32 AZN and delivery is available today."],
    ],
    sale: { product: "Lip gloss set", quantity: 1, revenue: 32 },
  },
];

let products = [
  { name: "Black hoodie", requests: 42, sales: 31, revenue: 1240, stock: 18, trend: "High demand" },
  { name: "Silver earrings", requests: 31, sales: 22, revenue: 770, stock: 6, trend: "Restock soon" },
  { name: "Lip gloss set", requests: 24, sales: 19, revenue: 608, stock: 14, trend: "Growing" },
  { name: "Gift box", requests: 18, sales: 12, revenue: 240, stock: 40, trend: "Seasonal" },
];

let team = [
  { name: "Aysel", role: "Owner", conversations: 86, reply: "5m", status: "Online" },
  { name: "Murad", role: "Sales assistant", conversations: 54, reply: "9m", status: "Online" },
  { name: "Leyla", role: "Support", conversations: 39, reply: "14m", status: "Away" },
];

let plans = [
  { name: "Starter", price: "29 AZN", current: true, features: ["3 channels", "2 team members", "AI summaries"] },
  { name: "Growth", price: "59 AZN", current: false, features: ["6 channels", "6 team members", "Product demand AI"] },
  { name: "Pro", price: "99 AZN", current: false, features: ["Unlimited channels", "Advanced analytics", "Priority support"] },
];

const app = document.querySelector("#app");
const toast = document.querySelector("#toast");

function money(value) {
  return `${value.toLocaleString()} AZN`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 2200);
}

function replaceConversation(updatedConversation) {
  const index = conversations.findIndex((conversation) => conversation.id === updatedConversation.id);

  if (index >= 0) {
    conversations[index] = updatedConversation;
  }
}

function updateCurrentPlanCard() {
  const card = document.querySelector("#currentPlanCard");
  const currentPlan = plans.find((plan) => plan.current) || plans[0];

  if (!card || !currentPlan) return;

  card.querySelector("strong").textContent = currentPlan.name;
  card.querySelector("span").textContent = `${currentPlan.price} / month`;
}

function installIcons(root = document) {
  root.querySelectorAll("[data-icon]").forEach((element) => {
    element.innerHTML = icons[element.dataset.icon] || "";
  });
}

function setPage(page) {
  state.page = page;
  window.location.hash = page;
  document.querySelectorAll("[data-page]").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === page);
  });
  render();
}

function metricCards() {
  const totalSales = conversations.reduce((sum, item) => sum + item.sale.revenue, 0) + 4553;
  return `
    <section class="metrics-grid" aria-label="Business metrics">
      <article class="metric-card revenue">
        <span class="metric-icon" data-icon="money"></span>
        <p>Estimated Sales</p>
        <strong>${money(totalSales)}</strong>
        <small>+18% from last week</small>
      </article>
      <article class="metric-card">
        <span class="metric-icon" data-icon="clock"></span>
        <p>Avg. Reply Time</p>
        <strong>7m 24s</strong>
        <small>${conversations.filter((item) => item.urgent).length} urgent chats waiting</small>
      </article>
      <article class="metric-card">
        <span class="metric-icon" data-icon="bag"></span>
        <p>Top Product</p>
        <strong>Black Hoodie</strong>
        <small>42 requests this month</small>
      </article>
      <article class="metric-card">
        <span class="metric-icon" data-icon="users"></span>
        <p>Active Subscribers</p>
        <strong>229</strong>
        <small>Across 3 message channels</small>
      </article>
    </section>
  `;
}

function pageHeader(title, eyebrow, action = true) {
  return `
    <header class="topbar">
      <div>
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
      </div>
      <div class="topbar-actions">
        <label class="search-box" aria-label="Search">
          <span data-icon="search"></span>
          <input id="searchInput" type="search" placeholder="Search customers or products" value="${state.query}" />
        </label>
        <button class="icon-button" id="notificationButton" aria-label="Notifications">
          <span data-icon="bell"></span>
        </button>
        ${
          action
            ? `<button class="primary-action" id="summaryButton"><span data-icon="spark"></span>AI Summary</button>`
            : ""
        }
      </div>
    </header>
  `;
}

function filteredConversations() {
  const query = state.query.trim().toLowerCase();
  return conversations.filter((item) => {
    const matchesFilter =
      state.filter === "All" ||
      (state.filter === "Open" && !item.urgent) ||
      (state.filter === "Urgent" && item.urgent);
    const matchesQuery =
      !query ||
      item.customer.toLowerCase().includes(query) ||
      item.preview.toLowerCase().includes(query) ||
      item.sale.product.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
}

function conversationList(items = filteredConversations()) {
  return `
    <div class="message-list">
      ${items
        .map(
          (item) => `
            <button class="message-item ${item.id === state.selectedId ? "active" : ""} ${
              item.urgent ? "attention" : ""
            }" type="button" data-select-conversation="${item.id}">
              <span class="avatar ${item.avatar}">${item.initials}</span>
              <span class="message-copy">
                <strong>${item.customer}</strong>
                <small>${item.channel}</small>
                <span>${item.preview}</span>
              </span>
              <span class="message-meta">
                <time>${item.time}</time>
                ${item.status ? `<mark>${item.status}</mark>` : ""}
              </span>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function renderInbox() {
  const selected = conversations.find((item) => item.id === state.selectedId) || conversations[0];
  return `
    ${pageHeader("A simple subscription tool for small shops to manage messages and sales.", "Micro SaaS for Social Commerce")}
    ${metricCards()}
    <section class="workspace">
      <section class="inbox-panel" aria-label="Unified inbox">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Unified Inbox</p>
            <h2>Customer Messages</h2>
          </div>
          <div class="segmented-control" role="tablist" aria-label="Inbox filters">
            ${["All", "Open", "Urgent"]
              .map(
                (filter) =>
                  `<button class="${state.filter === filter ? "active" : ""}" type="button" data-filter="${filter}">${filter}</button>`
              )
              .join("")}
          </div>
        </div>
        ${conversationList()}
      </section>

      <section class="conversation-panel" aria-label="Selected conversation">
        <div class="conversation-header">
          <div class="customer-title">
            <span class="avatar ${selected.avatar}">${selected.initials}</span>
            <div>
              <h2>${selected.customer}</h2>
              <p>${selected.channel} - Online now</p>
            </div>
          </div>
          <button class="icon-button" data-backend-action="priority" aria-label="More conversation actions">
            <span data-icon="more"></span>
          </button>
        </div>
        <div class="conversation-body">
          ${selected.messages.map(([type, text]) => `<div class="chat-bubble ${type}">${text}</div>`).join("")}
        </div>
        <div class="backend-proof">
          Chat updates are rendered from Flask responses. Backend sample replies include a timestamp.
        </div>
        <form class="reply-box" id="replyForm">
          <button class="icon-button" type="button" data-backend-action="attachment" aria-label="Attach file">
            <span data-icon="paperclip"></span>
          </button>
          <input id="replyInput" type="text" value="Sure, I can reserve them for you." aria-label="Reply message" />
          <button class="send-button" type="submit" aria-label="Send reply">
            <span data-icon="send"></span>
          </button>
        </form>
      </section>

      <aside class="ai-panel" aria-label="AI insights">
        <section class="insight-card attention-card">
          <div class="panel-heading compact">
            <div>
              <p class="eyebrow">Needs Attention</p>
              <h2>${conversations.filter((item) => item.urgent).length} conversations</h2>
            </div>
            <span data-icon="alert"></span>
          </div>
          <p class="muted">Customers waiting longer than 30 minutes are automatically moved here.</p>
        </section>
        <section class="insight-card">
          <p class="eyebrow">AI Sales Extraction</p>
          <div class="extraction-row"><span>Product</span><strong>${selected.sale.product}</strong></div>
          <div class="extraction-row"><span>Quantity</span><strong>${selected.sale.quantity}</strong></div>
          <div class="extraction-row"><span>Revenue</span><strong>${money(selected.sale.revenue)}</strong></div>
          <button class="secondary-action" type="button" id="createSaleButton">Create Sale Record</button>
        </section>
        <section class="insight-card">
          <p class="eyebrow">Frequently Requested</p>
          ${products
            .slice(0, 3)
            .map(
              (product) => `
                <div class="product-demand">
                  <span>${product.name}</span>
                  <meter min="0" max="50" value="${product.requests}"></meter>
                  <strong>${product.requests}</strong>
                </div>
              `
            )
            .join("")}
        </section>
        <section class="insight-card summary-card">
          <p class="eyebrow">Weekly AI Summary</p>
          <p>Subscription customers generated most revenue through Instagram DMs. Hoodies and silver jewelry drove demand, while slow replies after 18:00 caused missed opportunities.</p>
        </section>
      </aside>
    </section>
  `;
}

function renderAttention() {
  const urgent = conversations.filter((item) => item.urgent);
  return `
    ${pageHeader("Reply to waiting customers before sales are lost.", "Needs Attention")}
    <section class="two-column">
      <div class="inbox-panel">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Unanswered Queue</p>
            <h2>${urgent.length} urgent conversations</h2>
          </div>
          <button class="primary-action" data-backend-action="assign-urgent"><span data-icon="check"></span>Assign All</button>
        </div>
        ${conversationList(urgent)}
      </div>
      <div class="stack">
        <section class="insight-card attention-card">
          <p class="eyebrow">Rule Active</p>
          <h2>Move to attention after 30 minutes</h2>
          <p class="muted">InboxPilot checks every connected channel and flags conversations without a staff reply.</p>
        </section>
        <section class="insight-card">
          <p class="eyebrow">Suggested Replies</p>
          <button class="quick-reply" data-backend-action="quick-reply">Yes, this item is available. Please send size and delivery address.</button>
          <button class="quick-reply" data-backend-action="quick-reply">We can reserve it for you today. Delivery is available in Baku.</button>
          <button class="quick-reply" data-backend-action="quick-reply">This product is low in stock. Would you like us to hold it?</button>
        </section>
      </div>
    </section>
  `;
}

function renderInsights() {
  const maxRevenue = Math.max(...products.map((item) => item.revenue));
  return `
    ${pageHeader("AI turns conversations into simple sales analytics.", "Sales Insights")}
    ${metricCards()}
    <section class="analytics-grid">
      <article class="insight-card wide-card">
        <p class="eyebrow">Revenue Trend</p>
        <div class="bar-chart">
          ${[420, 680, 540, 920, 860, 1180, 1240]
            .map((value, index) => `<span style="--height:${Math.round(value / 14)}%"><strong>${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}</strong></span>`)
            .join("")}
        </div>
      </article>
      <article class="insight-card">
        <p class="eyebrow">Top Products</p>
        ${products
          .map(
            (item) => `
              <div class="rank-row">
                <span>${item.name}</span>
                <meter min="0" max="${maxRevenue}" value="${item.revenue}"></meter>
                <strong>${money(item.revenue)}</strong>
              </div>
            `
          )
          .join("")}
      </article>
      <article class="insight-card">
        <p class="eyebrow">AI Findings</p>
        <ul class="clean-list">
          <li>Instagram DMs produce 61% of estimated revenue.</li>
          <li>Saturday has the highest purchase intent.</li>
          <li>Silver earrings should be restocked within 3 days.</li>
          <li>Replies under 10 minutes convert 27% better.</li>
        </ul>
      </article>
    </section>
  `;
}

function renderProducts() {
  return `
    ${pageHeader("Track demand, stock risk, and products customers request most.", "Products")}
    <section class="table-card">
      <div class="panel-heading">
        <div>
          <p class="eyebrow">AI Product Demand</p>
          <h2>Requested Products</h2>
        </div>
        <button class="primary-action" data-backend-action="add-product"><span data-icon="plus"></span>Add Product</button>
      </div>
      <div class="data-table">
        <div class="table-row table-head"><span>Product</span><span>Requests</span><span>Sales</span><span>Revenue</span><span>Stock</span><span>Signal</span></div>
        ${products
          .map(
            (item) => `
              <div class="table-row">
                <strong>${item.name}</strong>
                <span>${item.requests}</span>
                <span>${item.sales}</span>
                <span>${money(item.revenue)}</span>
                <span>${item.stock}</span>
                <mark>${item.trend}</mark>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderTeam() {
  return `
    ${pageHeader("Manage employees, ownership, and reply performance.", "Team")}
    <section class="cards-grid">
      ${team
        .map(
          (member) => `
            <article class="person-card">
              <span class="avatar">${member.name.slice(0, 2).toUpperCase()}</span>
              <h2>${member.name}</h2>
              <p>${member.role}</p>
              <div class="extraction-row"><span>Conversations</span><strong>${member.conversations}</strong></div>
              <div class="extraction-row"><span>Avg. reply</span><strong>${member.reply}</strong></div>
              <div class="extraction-row"><span>Status</span><strong>${member.status}</strong></div>
              <button class="secondary-action" data-backend-action="manage-member" data-member="${member.name}">Manage</button>
            </article>
          `
        )
        .join("")}
      <article class="person-card add-card">
        <span data-icon="plus"></span>
        <h2>Invite teammate</h2>
        <p>Add employees without sharing social media passwords.</p>
        <button class="primary-action" data-backend-action="invite-member">Send Invite</button>
      </article>
    </section>
  `;
}

function renderBilling() {
  return `
    ${pageHeader("Choose the subscription plan that matches the shop size.", "Billing", false)}
    <section class="pricing-grid">
      ${plans
        .map(
          (plan) => `
            <article class="price-card ${plan.current ? "current" : ""}">
              <p class="eyebrow">${plan.current ? "Current Plan" : "Upgrade Option"}</p>
              <h2>${plan.name}</h2>
              <strong>${plan.price}<span>/ month</span></strong>
              <ul class="clean-list">
                ${plan.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
              <button class="${plan.current ? "secondary-action" : "primary-action"}" data-backend-action="select-plan" data-plan="${plan.name}">${plan.current ? "Active" : "Choose Plan"}</button>
            </article>
          `
        )
        .join("")}
    </section>
  `;
}

function modalSummary(summary) {
  return `
    <div class="modal-backdrop" id="summaryModal">
      <section class="summary-modal" role="dialog" aria-modal="true" aria-labelledby="summaryTitle">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">AI Daily Summary</p>
            <h2 id="summaryTitle">Today at a glance</h2>
          </div>
          <button class="icon-button" id="closeModal" aria-label="Close summary">x</button>
        </div>
        <div class="modal-content">
          <div class="extraction-row"><span>Estimated revenue</span><strong>${summary.estimated_revenue}</strong></div>
          <div class="extraction-row"><span>Most requested</span><strong>${summary.most_requested}</strong></div>
          <div class="extraction-row"><span>Needs reply</span><strong>${summary.needs_reply} chats</strong></div>
          <p class="muted">Recommendation: ${summary.recommendation}</p>
        </div>
      </section>
    </div>
  `;
}

function productModal() {
  return `
    <div class="modal-backdrop" id="productModal">
      <section class="summary-modal" role="dialog" aria-modal="true" aria-labelledby="productTitle">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Add Product</p>
            <h2 id="productTitle">Create tracked product</h2>
          </div>
          <button class="icon-button" data-close-modal aria-label="Close product form">x</button>
        </div>
        <form class="modal-content form-grid" id="productForm">
          <label>
            Product name
            <input name="name" type="text" value="Cream cardigan" required />
          </label>
          <label>
            Requests
            <input name="requests" type="number" min="0" value="9" />
          </label>
          <label>
            Sales
            <input name="sales" type="number" min="0" value="4" />
          </label>
          <label>
            Revenue
            <input name="revenue" type="number" min="0" value="180" />
          </label>
          <label>
            Stock
            <input name="stock" type="number" min="0" value="12" />
          </label>
          <label>
            Signal
            <select name="trend">
              <option>Manual</option>
              <option>High demand</option>
              <option>Restock soon</option>
              <option>Growing</option>
            </select>
          </label>
          <button class="primary-action" type="submit">Save Product</button>
        </form>
      </section>
    </div>
  `;
}

function permissionsModal(member, permissions) {
  const permissionLabels = {
    can_reply: "Reply to conversations",
    can_create_sales: "Create sale records",
    can_manage_billing: "Manage billing",
    can_invite_team: "Invite team members",
  };

  return `
    <div class="modal-backdrop" id="permissionsModal">
      <section class="summary-modal" role="dialog" aria-modal="true" aria-labelledby="permissionsTitle">
        <div class="panel-heading">
          <div>
            <p class="eyebrow">Team Permissions</p>
            <h2 id="permissionsTitle">${member.name}</h2>
          </div>
          <button class="icon-button" data-close-modal aria-label="Close permissions">x</button>
        </div>
        <div class="modal-content">
          <div class="extraction-row"><span>Role</span><strong>${member.role}</strong></div>
          <div class="extraction-row"><span>Status</span><strong>${member.status}</strong></div>
          <div class="permission-list">
            ${Object.entries(permissions)
              .map(
                ([key, enabled]) => `
                  <label class="permission-row">
                    <span>${permissionLabels[key]}</span>
                    <input type="checkbox" ${enabled ? "checked" : ""} />
                  </label>
                `
              )
              .join("")}
          </div>
          <button class="primary-action" data-close-modal type="button">Done</button>
        </div>
      </section>
    </div>
  `;
}

function render() {
  const views = {
    inbox: renderInbox,
    attention: renderAttention,
    insights: renderInsights,
    products: renderProducts,
    team: renderTeam,
    billing: renderBilling,
  };
  app.innerHTML = (views[state.page] || renderInbox)();
  installIcons(app);
  updateCurrentPlanCard();
}

async function loadBackendData() {
  try {
    const response = await fetch(apiUrl("/api/bootstrap"), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return;

    const data = await response.json();
    conversations = data.conversations || conversations;
    products = data.products || products;
    team = data.team || team;
    plans = data.plans || plans;
    state.selectedId = conversations[0]?.id || state.selectedId;
    updateCurrentPlanCard();
  } catch (error) {
    console.info("Using local demo data because Flask API is not available.");
  }
}

async function getJson(url) {
  try {
    const response = await fetch(apiUrl(url), {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

async function postJson(url, payload) {
  try {
    const response = await fetch(apiUrl(url), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    return null;
  }
}

async function handleBackendAction(button) {
  const action = button.dataset.backendAction;

  if (action === "priority") {
    const selected = conversations.find((item) => item.id === state.selectedId);
    const result = await postJson(`/api/conversations/${selected.id}/priority`, {});
    selected.status = result?.status || "Priority";
    showToast(result?.message || "Conversation marked as priority");
    render();
    return;
  }

  if (action === "attachment") {
    showToast("Attachment action is frontend-only for now");
    return;
  }

  if (action === "assign-urgent") {
    const result = await postJson("/api/conversations/assign-urgent", {});
    conversations.forEach((conversation) => {
      if (conversation.urgent) {
        conversation.urgent = false;
        conversation.status = "Assigned";
      }
    });
    showToast(result?.message || "Urgent conversations assigned");
    render();
    return;
  }

  if (action === "quick-reply") {
    const selected = conversations.find((item) => item.id === state.selectedId);
    const result = await postJson(`/api/conversations/${selected.id}/reply`, { text: button.textContent.trim() });
    if (!result?.conversation) {
      showToast("Backend did not process suggested reply");
      return;
    }
    replaceConversation(result.conversation);
    showToast("Suggested reply processed by backend");
    render();
    return;
  }

  if (action === "add-product") {
    document.body.insertAdjacentHTML("beforeend", productModal());
    return;
  }

  if (action === "manage-member") {
    const member = button.dataset.member;
    const result = await postJson(`/api/team/${encodeURIComponent(member)}/permissions`, {});
    if (!result?.member || !result?.permissions) {
      showToast("Backend did not load permissions");
      return;
    }
    document.body.insertAdjacentHTML("beforeend", permissionsModal(result.member, result.permissions));
    showToast(result.message);
    return;
  }

  if (action === "invite-member") {
    const result = await postJson("/api/team/invite", {});
    if (!result?.member) {
      showToast("Backend did not process invite");
      return;
    }
    team.push(result.member);
    showToast("Invite processed by backend");
    render();
    return;
  }

  if (action === "select-plan") {
    const result = await postJson("/api/billing/select", { plan: button.dataset.plan });
    if (result?.selected) {
      plans = result.plans || plans.map((plan) => ({ ...plan, current: plan.name === button.dataset.plan }));
    }
    if (!result?.selected) {
      showToast("Backend did not select plan");
      return;
    }
    showToast(`${button.dataset.plan} plan selected by backend`);
    render();
    updateCurrentPlanCard();
  }
}

document.addEventListener("click", async (event) => {
  const pageLink = event.target.closest("[data-page]");
  if (pageLink) {
    event.preventDefault();
    setPage(pageLink.dataset.page);
    return;
  }

  const filterButton = event.target.closest("[data-filter]");
  if (filterButton) {
    state.filter = filterButton.dataset.filter;
    render();
    return;
  }

  const conversationButton = event.target.closest("[data-select-conversation]");
  if (conversationButton) {
    state.selectedId = Number(conversationButton.dataset.selectConversation);
    setPage("inbox");
    return;
  }

  const actionButton = event.target.closest("[data-backend-action]");
  if (actionButton) {
    await handleBackendAction(actionButton);
    return;
  }

  if (event.target.closest("#summaryButton")) {
    const summary = await getJson("/api/summary");
    document.body.insertAdjacentHTML(
      "beforeend",
      modalSummary(
        summary || {
          estimated_revenue: "4,820 AZN",
          most_requested: "Black hoodie",
          needs_reply: conversations.filter((item) => item.urgent).length,
          recommendation:
            "Restock silver earrings, assign WhatsApp replies after 18:00, and follow up with hoodie buyers tomorrow morning.",
        }
      )
    );
    installIcons(document.querySelector("#summaryModal"));
    return;
  }

  if (event.target.closest("#notificationButton")) {
    const notifications = await getJson("/api/notifications");
    showToast(notifications?.message || "2 unanswered chats and 1 stock warning");
    return;
  }

  if (event.target.closest("[data-close-modal]") || event.target.classList.contains("modal-backdrop")) {
    event.target.closest(".modal-backdrop")?.remove();
    return;
  }

  if (event.target.closest("#createSaleButton")) {
    const selected = conversations.find((item) => item.id === state.selectedId);
    const result = await postJson("/api/sales", selected.sale);
    if (!result?.created) {
      showToast("Backend did not create sale record");
      return;
    }
    state.saleRecords.push(result.sale);
    showToast(`${selected.sale.product} sale record created by backend`);
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "searchInput") {
    state.query = event.target.value;
    render();
    const searchInput = document.querySelector("#searchInput");
    searchInput?.focus();
    searchInput?.setSelectionRange(state.query.length, state.query.length);
  }
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "productForm") {
    event.preventDefault();
    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());
    payload.requests = Number(payload.requests || 0);
    payload.sales = Number(payload.sales || 0);
    payload.revenue = Number(payload.revenue || 0);
    payload.stock = Number(payload.stock || 0);

    const result = await postJson("/api/products", payload);

    if (!result?.product) {
      showToast(result?.error || "Backend did not add product");
      return;
    }

    products.push(result.product);
    document.querySelector("#productModal")?.remove();
    showToast(`${result.product.name} added by backend`);
    render();
    return;
  }

  if (event.target.id === "replyForm") {
    event.preventDefault();
    const input = document.querySelector("#replyInput");
    const selected = conversations.find((item) => item.id === state.selectedId);
    if (!input.value.trim()) return;
    const replyText = input.value.trim();
    input.disabled = true;
    const result = await postJson(`/api/conversations/${selected.id}/reply`, { text: replyText });
    input.disabled = false;

    if (!result?.backend_processed || !result?.conversation) {
      showToast("Backend did not process reply. Start Flask and open http://127.0.0.1:5000");
      return;
    }

    replaceConversation(result.conversation);
    showToast("Reply and sample customer response came from backend");
    render();
  }
});

window.addEventListener("hashchange", () => {
  const page = window.location.hash.replace("#", "") || "inbox";
  if (page !== state.page) setPage(page);
});

async function startApp() {
  installIcons();
  await loadBackendData();
  setPage(state.page);
}

startApp();
