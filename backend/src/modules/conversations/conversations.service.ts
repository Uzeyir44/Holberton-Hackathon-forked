import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";
import { backendStamp } from "../../utils/helpers";
export async function listConversations(
  businessId: string,
  filters: { status?: string; platform?: string; urgent?: string },
) {
  const where: any = { businessId };

  if (filters.status) {
    where.status = filters.status.toUpperCase() as any;
  }
  if (filters.platform) {
    where.platform = filters.platform.toUpperCase() as any;
  }
  if (filters.urgent === "true") {
    where.isUrgent = true;
  }

  const conversations = await prisma.conversation.findMany({
    where,
    include: {
      messages: {
        orderBy: { sentAt: "asc" },
        take: 1,
      },
      _count: { select: { messages: true } },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return conversations.map((c: any) => ({
    id: c.id,
    customerName: c.customerName,
    platform: c.platform,
    lastMessageAt: c.lastMessageAt,
    status: c.status,
    isUrgent: c.isUrgent,
    preview: c.messages[0]?.content || "",
    messageCount: c._count.messages,
  }));
}

export async function getConversationById(conversationId: string, businessId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, businessId },
    include: {
      messages: { orderBy: { sentAt: "asc" } },
      aiExtractions: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  return conversation;
}

export async function replyToConversation(
  conversationId: string,
  businessId: string,
  text: string,
) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, businessId },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  const outgoing = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderType: "BUSINESS",
      content: text,
    },
  });

  const autoReplyText = `Backend customer reply at ${backendStamp()}: Thanks, I received your message. Please reserve it for me.`;

  const incoming = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderType: "CUSTOMER",
      content: autoReplyText,
    },
  });

  const updated = await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      status: "NEEDS_ATTENTION",
      isUrgent: true,
      lastMessageAt: new Date(),
    },
    include: {
      messages: { orderBy: { sentAt: "asc" } },
    },
  });

  return {
    conversation_id: conversation.id,
    message: ["outgoing", text],
    auto_reply: ["incoming", autoReplyText],
    status: "Customer replied",
    preview: autoReplyText,
    conversation: formatConversationForFrontend(updated),
    backend_processed: true,
  };
}

export async function assignUrgent(businessId: string) {
  const result = await prisma.conversation.updateMany({
    where: { businessId, isUrgent: true },
    data: { isUrgent: false, status: "ACTIVE" },
  });

  return { assigned: result.count, message: `${result.count} urgent conversations assigned` };
}

export async function markPriority(conversationId: string, businessId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, businessId },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { status: "NEEDS_ATTENTION", isUrgent: true },
  });

  return { conversation_id: conversationId, status: "Priority", message: "Conversation marked as priority" };
}

export async function getUnansweredConversations(businessId: string) {
  const conversations = await prisma.conversation.findMany({
    where: { businessId, isUrgent: true },
    include: {
      messages: {
        orderBy: { sentAt: "desc" },
        take: 1,
      },
    },
    orderBy: { lastMessageAt: "asc" },
  });

  return conversations.map((c: any) => {
    const lastMsg = c.messages[0];
    const unrepliedMinutes = lastMsg
      ? Math.floor((Date.now() - lastMsg.sentAt.getTime()) / 60000)
      : 0;

    return {
      id: c.id,
      customerName: c.customerName,
      status: c.status,
      unrepliedMinutes,
      lastMessage: lastMsg?.content || "",
      platform: c.platform,
    };
  });
}

function formatConversationForFrontend(conversation: any) {
  const customerInitials = conversation.customerName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return {
    id: Number(conversation.id.slice(0, 8)),
    initials: customerInitials,
    avatar: "",
    customer: conversation.customerName,
    channel: conversation.platform === "INSTAGRAM" ? "Instagram DM" : conversation.platform === "WHATSAPP" ? "WhatsApp" : "Telegram",
    time: "",
    status: conversation.isUrgent ? "Unanswered" : "",
    urgent: conversation.isUrgent,
    preview: conversation.messages?.[conversation.messages.length - 1]?.content || "",
    messages: (conversation.messages || []).map((m: any) => [
      m.senderType === "BUSINESS" ? "outgoing" : "incoming",
      m.content,
    ]),
    sale: { product: "", quantity: 0, revenue: 0 },
  };
}
