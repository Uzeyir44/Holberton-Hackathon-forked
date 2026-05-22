import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import * as analyticsController from "./analytics.controller";

const router = Router();

router.use(authGuard);

router.get("/sales", analyticsController.getSales);
router.get("/products", analyticsController.getProducts);
router.get("/metrics", analyticsController.getMetrics);
router.post("/metrics/demo-update", analyticsController.demoUpdateMetrics);

export default router;
