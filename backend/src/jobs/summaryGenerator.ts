import cron from "node-cron";
import prisma from "../config/database";

export function startSummaryGenerator() {
  cron.schedule("0 23 * * *", async () => {
    console.log("[SummaryGenerator] Generating daily summaries...");

    try {
      const businesses = await prisma.business.findMany();

      for (const business of businesses) {
        const conversations = await prisma.conversation.findMany({
          where: { businessId: business.id },
          include: { aiExtractions: true },
        });

        const totalRevenue = conversations.reduce((sum, c) => {
          const ext = c.aiExtractions[0];
          return sum + (ext?.revenue || 0);
        }, 0);

        const productMap = new Map<string, number>();
        for (const c of conversations) {
          for (const ext of c.aiExtractions) {
            if (ext.productName) {
              productMap.set(ext.productName, (productMap.get(ext.productName) || 0) + 1);
            }
          }
        }

        const topProducts = Array.from(productMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, requests]) => ({ name, requests }));

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existing = await prisma.analyticsSummary.findFirst({
          where: {
            businessId: business.id,
            type: "daily",
            periodStart: today,
          },
        });

        if (!existing) {
          await prisma.analyticsSummary.create({
            data: {
              businessId: business.id,
              type: "daily",
              periodStart: today,
              periodEnd: new Date(),
              estimatedRevenue: totalRevenue,
              topProducts: JSON.stringify(topProducts),
              urgentCount: conversations.filter((c) => c.isUrgent).length,
              recommendations: "Daily summary generated automatically.",
            },
          });
        }
      }

      console.log(`[SummaryGenerator] Generated summaries for ${businesses.length} businesses`);
    } catch (error) {
      console.error("[SummaryGenerator] Error:", error);
    }
  });

  console.log("[SummaryGenerator] Started (runs daily at 23:00)");
}
