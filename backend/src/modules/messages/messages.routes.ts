import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import * as messagesController from "./messages.controller";

const router = Router();

router.use(authGuard);
router.get("/:convId", messagesController.getByConversation);

export default router;
