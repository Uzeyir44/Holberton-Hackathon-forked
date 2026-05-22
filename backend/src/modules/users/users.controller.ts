import { Response } from "express";
import { AuthRequest } from "../../middleware/authGuard";
import * as usersService from "./users.service";

export async function getTeam(req: AuthRequest, res: Response) {
  const team = await usersService.getTeam(req.businessId!);
  res.json({ team });
}

export async function inviteMember(req: AuthRequest, res: Response) {
  const member = await usersService.inviteMember(req.businessId!);
  res.status(201).json({ invited: true, member });
}

export async function getPermissions(req: AuthRequest, res: Response) {
  const result = await usersService.getPermissions(req.params.name as string, req.businessId!);
  res.json(result);
}
