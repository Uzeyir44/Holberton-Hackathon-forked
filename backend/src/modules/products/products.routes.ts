import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import * as productsController from "./products.controller";

const router = Router();

router.use(authGuard);
router.get("/", productsController.list);
router.post("/", productsController.create);

export default router;
