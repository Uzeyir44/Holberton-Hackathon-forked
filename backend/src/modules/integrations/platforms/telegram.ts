import { Router } from "express";
import { config } from "../../../config";

const router = Router();

router.post("/webhook", async (req, res) => {
  const body = req.body;
  console.log("[Telegram webhook] Received:", JSON.stringify(body).slice(0, 200));

  if (body.message?.text) {
    const chatId = body.message.chat.id;
    const text = body.message.text;

    console.log(`[Telegram] Message from ${chatId}: ${text}`);
  }

  res.sendStatus(200);
});

export async function setTelegramWebhook() {
  if (!config.telegramBotToken) return;

  const url = `https://api.telegram.org/bot${config.telegramBotToken}/setWebhook`;
  const webhookUrl = `${process.env.PUBLIC_URL || "https://example.com"}/api/integrations/telegram/webhook`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: webhookUrl }),
    });
    const data = await response.json();
    console.log("[Telegram] Webhook set:", data.description || data.ok);
  } catch (err) {
    console.error("[Telegram] Failed to set webhook:", err);
  }
}

export default router;
