import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import { validate } from "../../middleware/validate";
import { replySchema } from "./conversations.validation";
import * as conversationsController from "./conversations.controller";

const router = Router();

router.use(authGuard);

router.get("/", conversationsController.list);
router.get("/unanswered", conversationsController.getUnanswered);
router.get("/:id", conversationsController.getById);
router.post("/:id/reply", validate(replySchema), conversationsController.reply);
router.post("/:id/priority", conversationsController.markPriority);
router.post("/assign-urgent", conversationsController.assignUrgent);

export default router;
