import { Router } from "express";
import * as bootstrapController from "./bootstrap.controller";

const router = Router();

router.get("/", bootstrapController.bootstrap);

export default router;
