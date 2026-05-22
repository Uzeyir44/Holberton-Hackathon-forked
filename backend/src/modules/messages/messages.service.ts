import prisma from "../../config/database";
import { NotFoundError } from "../../utils/errors";

export async function getMessagesByConversation(conversationId: string, businessId: string) {
  const conversation = await prisma.conversation.findFirst({
    where: { id: conversationId, businessId },
  });

  if (!conversation) {
    throw new NotFoundError("Conversation not found");
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { sentAt: "asc" },
  });

  return messages;
}
