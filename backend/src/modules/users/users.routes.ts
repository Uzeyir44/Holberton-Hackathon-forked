import { Router } from "express";
import { authGuard } from "../../middleware/authGuard";
import * as usersController from "./users.controller";

const router = Router();

router.use(authGuard);

router.get("/", usersController.getTeam);
router.post("/invite", usersController.inviteMember);
router.post("/:name/permissions", usersController.getPermissions);

export default router;
