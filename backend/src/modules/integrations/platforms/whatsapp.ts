import { Router } from "express";

const router = Router();

router.post("/webhook", (req, res) => {
  const body = req.body;
  console.log("[WhatsApp webhook] Received:", JSON.stringify(body).slice(0, 200));
  res.sendStatus(200);
});

router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("[WhatsApp webhook] Verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

export default router;
