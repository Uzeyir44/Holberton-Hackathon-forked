import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authGuard";

export function demoContext(req: AuthRequest, _res: Response, next: NextFunction): void {
  if (!req.businessId) {
    req.businessId = "demo-business-id";
    req.userId = "demo-user-id";
    req.userRole = "owner";
  }
  next();
}
