import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import * as integrationsController from "./integrations.controller";
import instagramRouter from "./platforms/instagram";
import whatsappRouter from "./platforms/whatsapp";
import telegramRouter from "./platforms/telegram";

const router = Router();

router.use("/instagram", instagramRouter);
router.use("/whatsapp", whatsappRouter);
router.use("/telegram", telegramRouter);

router.post("/ingest", authGuard, integrationsController.ingest);
router.get("/channels", authGuard, integrationsController.getChannels);

export default router;
