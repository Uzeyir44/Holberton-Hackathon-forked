import cron from "node-cron";
import prisma from "../config/database";

const UNANSWERED_THRESHOLD_MINUTES = 30;

export function startUnansweredDetector() {
  cron.schedule("*/2 * * * *", async () => {
    console.log("[UnansweredDetector] Checking for unanswered conversations...");

    try {
      const threshold = new Date(Date.now() - UNANSWERED_THRESHOLD_MINUTES * 60 * 1000);

      const conversations = await prisma.conversation.findMany({
        where: {
          status: "ACTIVE",
          isUrgent: false,
          lastMessageAt: { lte: threshold },
        },
        include: {
          messages: {
            orderBy: { sentAt: "desc" },
            take: 1,
          },
        },
      });

      for (const conversation of conversations) {
        const lastMessage = conversation.messages[0];
        if (lastMessage && lastMessage.senderType === "CUSTOMER") {
          await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
              status: "NEEDS_ATTENTION",
              isUrgent: true,
            },
          });
          console.log(`[UnansweredDetector] Marked conversation ${conversation.id} as urgent`);
        }
      }

      if (conversations.length > 0) {
        console.log(`[UnansweredDetector] Processed ${conversations.length} conversations`);
      }
    } catch (error) {
      console.error("[UnansweredDetector] Error:", error);
    }
  });

  console.log(`[UnansweredDetector] Started (checking every 2 min, threshold: ${UNANSWERED_THRESHOLD_MINUTES} min)`);
}
