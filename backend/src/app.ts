import express from "express";
import path from "path";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config";
import { corsMiddleware } from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";
import { demoContext } from "./middleware/demoContext";

import authRoutes from "./modules/auth/auth.routes";
import conversationRoutes from "./modules/conversations/conversations.routes";
import messageRoutes from "./modules/messages/messages.routes";
import aiRoutes from "./modules/ai/ai.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import bootstrapRoutes from "./modules/analytics/bootstrap.routes";
import integrationRoutes from "./modules/integrations/integrations.routes";
import userRoutes from "./modules/users/users.routes";
import productRoutes from "./modules/products/products.routes";

import { startUnansweredDetector } from "./jobs/unansweredDetector";
import { startSummaryGenerator } from "./jobs/summaryGenerator";

import * as bootstrapService from "./modules/analytics/bootstrap.service";
import * as analyticsService from "./modules/analytics/analytics.service";
import * as integrationsService from "./modules/integrations/integrations.service";
import * as conversationsService from "./modules/conversations/conversations.service";
import * as usersService from "./modules/users/users.service";
import prisma from "./config/database";

const app = express();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(corsMiddleware);
app.use(morgan("dev"));
app.use(express.json());

const frontendPath = path.resolve(__dirname, "../..");
app.use(express.static(frontendPath));

app.use("/api/auth", authRoutes);

app.use("/api/bootstrap", bootstrapRoutes);

app.get("/api/channels", demoContext, async (req: any, res) => {
  const channels = await integrationsService.getChannels(req.businessId);
  res.json(channels);
});

app.get("/api/metrics", demoContext, async (req: any, res) => {
  const metrics = await analyticsService.getMetrics(req.businessId);
  res.json(metrics);
});

app.post("/api/metrics/demo-update", demoContext, async (_req: any, res) => {
  const metrics = await analyticsService.getMetrics("demo-business-id");
  metrics.backend_revision = (metrics.backend_revision || 0) + 1;
  metrics.estimated_sales += 137;
  res.json(metrics);
});

app.get("/api/summary", demoContext, async (req: any, res) => {
  const aiService = await import("./modules/ai/ai.service");
  const conversations = await prisma.conversation.findMany({
    where: { businessId: req.businessId },
    include: { messages: { take: 5, orderBy: { sentAt: "desc" } } },
    take: 50,
  });
  const products = await prisma.product.findMany({
    where: { businessId: req.businessId },
  });

  const result = await aiService.generateSummary(
    JSON.stringify(conversations),
    JSON.stringify(products),
  );

  res.json({
    estimated_revenue: `${(result?.estimatedRevenue || 4820).toLocaleString()} AZN`,
    most_requested: result?.topProducts?.[0]?.name || "Black hoodie",
    needs_reply: result?.urgentCount || 1,
    recommendation: result?.recommendation || "All conversations handled well today.",
  });
});

app.get("/api/notifications", demoContext, async (req: any, res) => {
  const urgentCount = await prisma.conversation.count({
    where: { businessId: req.businessId, isUrgent: true },
  });
  const lowStockProducts = await prisma.product.findMany({
    where: { businessId: req.businessId, stock: { lte: 6 } },
    select: { name: true },
  });
  const lowStock = lowStockProducts.map((p: any) => p.name);

  res.json({
    message: `${urgentCount} unanswered chats and ${lowStock.length} stock warning${lowStock.length !== 1 ? "s" : ""}`,
    urgent_count: urgentCount,
    low_stock: lowStock,
  });
});

app.get("/api/conversations/:id", demoContext, async (req: any, res) => {
  try {
    const conversation = await conversationsService.getConversationById(
      req.params.id,
      req.businessId,
    );
    const initials = conversation.customerName
      .split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const avatars: Record<number, string> = { 0: "", 1: "green", 2: "blue", 3: "pink" };
    const idx = parseInt(conversation.id.slice(-1), 16) % 4;

    res.json({
      conversation: {
        id: parseInt(conversation.id.slice(0, 8), 16) || 1,
        initials,
        avatar: avatars[idx] || "",
        customer: conversation.customerName,
        channel: conversation.platform === "INSTAGRAM" ? "Instagram DM" : conversation.platform === "WHATSAPP" ? "WhatsApp" : "Telegram",
        time: conversation.lastMessageAt ? timeAgo(conversation.lastMessageAt) : "1h",
        status: conversation.isUrgent ? "Unanswered" : "",
        urgent: conversation.isUrgent,
        preview: conversation.messages?.[conversation.messages.length - 1]?.content || "",
        messages: (conversation.messages || []).map((m: any) => [
          m.senderType === "BUSINESS" ? "outgoing" : "incoming",
          m.content,
        ]),
        sale: conversation.aiExtractions?.[0]
          ? {
              product: conversation.aiExtractions[0].productName || "",
              quantity: conversation.aiExtractions[0].quantity || 0,
              revenue: conversation.aiExtractions[0].revenue || 0,
            }
          : { product: "", quantity: 0, revenue: 0 },
      },
    });
  } catch (err: any) {
    res.status(err.statusCode || 404).json({ error: err.message || "Conversation not found" });
  }
});

app.post("/api/conversations/:id/reply", demoContext, async (req: any, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      res.status(400).json({ error: "Reply text is required" });
      return;
    }
    const result = await conversationsService.replyToConversation(
      req.params.id,
      req.businessId,
      text,
    );
    const metrics = await analyticsService.getMetrics(req.businessId);
    const channels = await integrationsService.getChannels(req.businessId);
    res.json({ ...result, metrics, channels });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ error: err.message || "Reply failed" });
  }
});

app.post("/api/conversations/assign-urgent", demoContext, async (req: any, res) => {
  const result = await conversationsService.assignUrgent(req.businessId);
  const metrics = await analyticsService.getMetrics(req.businessId);
  res.json({ ...result, metrics });
});

app.post("/api/conversations/:id/priority", demoContext, async (req: any, res) => {
  try {
    const result = await conversationsService.markPriority(req.params.id, req.businessId);
    res.json(result);
  } catch (err: any) {
    res.status(err.statusCode || 404).json({ error: err.message || "Conversation not found" });
  }
});

app.post("/api/sales", demoContext, async (req: any, res) => {
  const { product, quantity, revenue } = req.body;
  if (!product || quantity === undefined || revenue === undefined) {
    res.status(400).json({ error: "Product, quantity, and revenue are required" });
    return;
  }

  await prisma.aIExtraction.create({
    data: {
      conversationId: "demo",
      productName: product,
      quantity: parseInt(quantity, 10),
      revenue: parseFloat(revenue),
      currency: "AZN",
      rawMessage: `Sale: ${quantity} x ${product} for ${revenue} AZN`,
    },
  });

  await prisma.product.upsert({
    where: { businessId_name: { businessId: req.businessId, name: product } },
    update: { sales: { increment: 1 }, revenue: { increment: parseFloat(revenue) } },
    create: { businessId: req.businessId, name: product, sales: 1, revenue: parseFloat(revenue) },
  });

  const metrics = await analyticsService.getMetrics(req.businessId);
  res.status(201).json({ created: true, sale: { product, quantity, revenue }, metrics });
});

app.get("/api/products", demoContext, async (req: any, res) => {
  let products = await prisma.product.findMany({
    where: { businessId: req.businessId },
    orderBy: { requests: "desc" },
  });

  if (products.length === 0) {
    products = [
      { id: "1", businessId: "", name: "Black hoodie", requests: 42, sales: 31, revenue: 1240, stock: 18, trend: "High demand", createdAt: new Date(), updatedAt: new Date() },
      { id: "2", businessId: "", name: "Silver earrings", requests: 31, sales: 22, revenue: 770, stock: 6, trend: "Restock soon", createdAt: new Date(), updatedAt: new Date() },
      { id: "3", businessId: "", name: "Lip gloss set", requests: 24, sales: 19, revenue: 608, stock: 14, trend: "Growing", createdAt: new Date(), updatedAt: new Date() },
      { id: "4", businessId: "", name: "Gift box", requests: 18, sales: 12, revenue: 240, stock: 40, trend: "Seasonal", createdAt: new Date(), updatedAt: new Date() },
    ];
  }

  res.json({ products });
});

app.post("/api/products", demoContext, async (req: any, res) => {
  const { name, requests, sales, revenue, stock, trend } = req.body;
  if (!name) {
    res.status(400).json({ error: "Product name is required" });
    return;
  }

  const product = await prisma.product.upsert({
    where: { businessId_name: { businessId: req.businessId, name } },
    update: {
      requests: parseInt(requests || 0, 10),
      sales: parseInt(sales || 0, 10),
      revenue: parseFloat(revenue || 0),
      stock: parseInt(stock || 0, 10),
      trend: trend || "Manual",
    },
    create: {
      businessId: req.businessId,
      name,
      requests: parseInt(requests || 0, 10),
      sales: parseInt(sales || 0, 10),
      revenue: parseFloat(revenue || 0),
      stock: parseInt(stock || 0, 10),
      trend: trend || "Manual",
    },
  });

  const metrics = await analyticsService.getMetrics(req.businessId);
  res.status(201).json({ created: true, product, metrics });
});

app.post("/api/team/invite", demoContext, async (req: any, res) => {
  const member = await usersService.inviteMember(req.businessId);
  const metrics = await analyticsService.getMetrics(req.businessId);
  res.status(201).json({ invited: true, member, metrics });
});

app.post("/api/team/:name/permissions", demoContext, async (req: any, res) => {
  try {
    const result = await usersService.getPermissions(req.params.name, req.businessId);
    res.json({ ...result, message: `${req.params.name} permissions loaded` });
  } catch (err: any) {
    res.status(err.statusCode || 404).json({ error: err.message || "Team member not found" });
  }
});

app.post("/api/billing/select", demoContext, async (_req: any, res) => {
  const plans = [
    { name: "Starter", price: "29 AZN", current: true, features: ["3 channels", "2 team members", "AI summaries"] },
    { name: "Growth", price: "59 AZN", current: false, features: ["6 channels", "6 team members", "Product demand AI"] },
    { name: "Pro", price: "99 AZN", current: false, features: ["Unlimited channels", "Advanced analytics", "Priority support"] },
  ];

  res.json({ selected: true, plan: plans[0], plans });
});

app.use("/api/conversations", conversationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/integrations", integrationRoutes);
app.use("/api/team", userRoutes);
app.use("/api/products", productRoutes);

app.get("*", (_req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.use(errorHandler);

startUnansweredDetector();
startSummaryGenerator();

app.listen(config.port, () => {
  console.log(`[InboxPilot] Server running on http://localhost:${config.port}`);
  console.log(`[InboxPilot] Environment: ${config.nodeEnv}`);
});

export default app;

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
