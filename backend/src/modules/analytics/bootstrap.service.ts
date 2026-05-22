import prisma from "../../config/database";
import { getMetrics } from "./analytics.service";
import { getChannels } from "../integrations/integrations.service";
import { getProductDemand } from "./analytics.service";
import { getTeam } from "../users/users.service";

const FALLBACK_BUSINESS_ID = "demo-business-id";

const PLANS = [
  { name: "Starter", price: "29 AZN", current: true, features: ["3 channels", "2 team members", "AI summaries"] },
  { name: "Growth", price: "59 AZN", current: false, features: ["6 channels", "6 team members", "Product demand AI"] },
  { name: "Pro", price: "99 AZN", current: false, features: ["Unlimited channels", "Advanced analytics", "Priority support"] },
];

export async function getBootstrapData(businessId: string = FALLBACK_BUSINESS_ID) {
  const conversations = await getDemoConversations(businessId);
  const products = await getProductDemand(businessId);
  const team = await getTeam(businessId);
  const metrics = await getMetrics(businessId);
  const channels = await getChannels(businessId);

  return {
    conversations,
    products,
    team,
    plans: PLANS,
    metrics,
    channels,
  };
}

async function getDemoConversations(businessId: string) {
  const dbConversations = await prisma.conversation.findMany({
    where: { businessId },
    include: {
      messages: { orderBy: { sentAt: "asc" } },
      aiExtractions: true,
    },
    orderBy: { lastMessageAt: "desc" },
  });

  if (dbConversations.length > 0) {
    return dbConversations.map((c: any, index: number) => {
      const initials = c.customerName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const avatars = ["", "green", "blue", "pink"];

      return {
        id: index + 1,
        initials,
        avatar: avatars[index % avatars.length],
        customer: c.customerName,
        channel: c.platform === "INSTAGRAM" ? "Instagram DM" : c.platform === "WHATSAPP" ? "WhatsApp" : "Telegram",
        time: c.lastMessageAt ? timeAgo(c.lastMessageAt) : "1h",
        status: c.isUrgent ? "Unanswered" : index === 0 ? "Hot" : "",
        urgent: c.isUrgent,
        preview: c.messages[c.messages.length - 1]?.content || "",
        messages: c.messages.map((m: any) => [
          m.senderType === "BUSINESS" ? "outgoing" : "incoming",
          m.content,
        ]),
        sale: c.aiExtractions[0]
          ? {
              product: c.aiExtractions[0].productName || "",
              quantity: c.aiExtractions[0].quantity || 0,
              revenue: c.aiExtractions[0].revenue || 0,
            }
          : { product: "", quantity: 0, revenue: 0 },
      };
    });
  }

  return [
    {
      id: 1, initials: "LA", avatar: "", customer: "Lara Accessories",
      channel: "Instagram DM", time: "2m", status: "Hot", urgent: false,
      preview: "Can I get 2 black hoodies for 80 AZN?",
      messages: [
        ["incoming", "Hi, do you have black hoodies? I need 2 pieces."],
        ["outgoing", "Hi, yes. Please send the sizes and delivery address."],
        ["incoming", "M and L sizes. 2 black hoodies for 80 AZN, delivery to Nizami."],
      ],
      sale: { product: "Black hoodie", quantity: 2, revenue: 80 },
    },
    {
      id: 2, initials: "NM", avatar: "green", customer: "Nigar M.",
      channel: "WhatsApp", time: "34m", status: "Unanswered", urgent: true,
      preview: "Do you still have silver earrings in stock?",
      messages: [
        ["incoming", "Do you still have silver earrings in stock?"],
        ["incoming", "I need 3 pairs today if possible."],
      ],
      sale: { product: "Silver earrings", quantity: 3, revenue: 105 },
    },
    {
      id: 3, initials: "EM", avatar: "blue", customer: "Elmir Boutique",
      channel: "Telegram", time: "48m", status: "", urgent: false,
      preview: "Need 5 gift boxes by tomorrow morning.",
      messages: [
        ["incoming", "Need 5 gift boxes by tomorrow morning."],
        ["outgoing", "We have matte black and rose gift boxes available."],
      ],
      sale: { product: "Gift box", quantity: 5, revenue: 50 },
    },
    {
      id: 4, initials: "SA", avatar: "pink", customer: "Sabina Aliyeva",
      channel: "Instagram DM", time: "1h", status: "", urgent: false,
      preview: "Please send price for rose lip gloss set.",
      messages: [
        ["incoming", "Please send price for rose lip gloss set."],
        ["outgoing", "The rose lip gloss set is 32 AZN and delivery is available today."],
      ],
      sale: { product: "Lip gloss set", quantity: 1, revenue: 32 },
    },
  ];
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
