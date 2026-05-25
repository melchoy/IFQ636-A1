import type { NextFunction, Request, Response } from "express";

import { verifyAdminToken, type AdminTokenPayload } from "../modules/admin-users/admin-user.tokens.js";
import { HttpError } from "./error-handler.js";

export interface AdminAuthRequest extends Request {
  admin?: AdminTokenPayload;
}

export function requireAdmin(req: AdminAuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new HttpError(401, "Not authorized"));
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    req.admin = verifyAdminToken(token);
    next();
  } catch {
    next(new HttpError(401, "Not authorized"));
  }
}
