import prisma from "../../config/database";
import { normalizeMessage, NormalizedMessage } from "./normalizer";
import { Platform } from "@prisma/client";
import { BadRequestError } from "../../utils/errors";

export async function ingestMessage(
  businessId: string,
  platform: string,
  rawPayload: any,
) {
  const platformEnum = platform.toUpperCase() as Platform;
  if (!["INSTAGRAM", "WHATSAPP", "TELEGRAM", "MANUAL"].includes(platformEnum)) {
    throw new BadRequestError(`Unsupported platform: ${platform}`);
  }

  const normalized = normalizeMessage(platformEnum, rawPayload);

  let conversation = await prisma.conversation.findFirst({
    where: {
      businessId,
      platform: platformEnum,
      customerId: normalized.customerId,
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        businessId,
        platform: platformEnum,
        customerName: normalized.customerName,
        customerId: normalized.customerId,
        status: "ACTIVE",
        lastMessageAt: normalized.timestamp,
      },
    });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderType: normalized.senderType,
      content: normalized.content,
      sentAt: normalized.timestamp,
      metadata: normalized.metadata,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { lastMessageAt: normalized.timestamp },
  });

  return { conversation, message };
}

export async function getChannels(businessId: string) {
  const integrations = await prisma.platformIntegration.findMany({
    where: { businessId },
  });

  if (integrations.length === 0) {
    return [
      { name: "Instagram", key: "instagram", count: 128 },
      { name: "WhatsApp", key: "whatsapp", count: 64 },
      { name: "Telegram", key: "telegram", count: 37 },
    ];
  }

  return integrations.map((i) => ({
    name: i.platform.charAt(0) + i.platform.slice(1).toLowerCase(),
    key: i.platform.toLowerCase(),
    count: 0,
  }));
}
