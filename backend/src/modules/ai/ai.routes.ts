import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import * as aiController from "./ai.controller";

const router = Router();

router.use(authGuard);

router.post("/extract", aiController.extract);
router.get("/summary", aiController.summary);

export default router;
