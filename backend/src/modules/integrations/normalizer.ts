import { Platform, SenderType } from "@prisma/client";

export interface NormalizedMessage {
  platform: Platform;
  platformConversationId: string;
  customerName: string;
  customerId: string;
  content: string;
  senderType: SenderType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export function normalizeInstagram(raw: any): NormalizedMessage {
  return {
    platform: "INSTAGRAM",
    platformConversationId: raw.conversation_id || raw.thread_id || "",
    customerName: raw.from?.username || raw.from?.name || "Instagram User",
    customerId: raw.from?.id || raw.sender_id || "",
    content: raw.message || raw.text || "",
    senderType: raw.from?.is_business ? "BUSINESS" : "CUSTOMER",
    timestamp: new Date(raw.timestamp || Date.now()),
    metadata: raw,
  };
}

export function normalizeWhatsApp(raw: any): NormalizedMessage {
  return {
    platform: "WHATSAPP",
    platformConversationId: raw.chat_id || raw.from || "",
    customerName: raw.from_name || raw.sender?.name || "WhatsApp User",
    customerId: raw.from || raw.sender?.phone || "",
    content: raw.text?.body || raw.body || raw.message || "",
    senderType: raw.from_me || raw.sender?.is_business ? "BUSINESS" : "CUSTOMER",
    timestamp: new Date((raw.timestamp || Date.now()) * 1000),
    metadata: raw,
  };
}

export function normalizeTelegram(raw: any): NormalizedMessage {
  const chat = raw.chat || raw.message?.chat || {};
  const from = raw.from || raw.message?.from || {};

  return {
    platform: "TELEGRAM",
    platformConversationId: String(chat.id || raw.chat_id || ""),
    customerName: chat.title || from.first_name || "Telegram User",
    customerId: String(from.id || raw.from_id || ""),
    content: raw.text || raw.message?.text || "",
    senderType: from.is_bot ? "BUSINESS" : "CUSTOMER",
    timestamp: new Date((raw.date || raw.message?.date || Date.now()) * 1000),
    metadata: raw,
  };
}

export function normalizeMessage(platform: Platform, raw: any): NormalizedMessage {
  switch (platform) {
    case "INSTAGRAM":
      return normalizeInstagram(raw);
    case "WHATSAPP":
      return normalizeWhatsApp(raw);
    case "TELEGRAM":
      return normalizeTelegram(raw);
    default:
      return {
        platform,
        platformConversationId: raw.id || "",
        customerName: raw.customer || raw.from || "Unknown",
        customerId: raw.customer_id || raw.from_id || "",
        content: raw.text || raw.message || "",
        senderType: "CUSTOMER",
        timestamp: new Date(),
        metadata: raw,
      };
  }
}
