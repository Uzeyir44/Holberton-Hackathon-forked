import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { UnauthorizedError } from "../utils/errors";

export interface AuthRequest extends Request {
  userId?: string;
  businessId?: string;
  userRole?: string;
}

export function authGuard(req: AuthRequest, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid token");
  }

  const token = header.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    req.businessId = payload.businessId;
    req.userRole = payload.role;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
