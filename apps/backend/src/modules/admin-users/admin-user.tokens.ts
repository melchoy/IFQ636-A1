import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

export interface AdminTokenPayload {
  id: string;
  email: string;
}

export function generateAdminToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, env.adminJwtSecret, { expiresIn: "30d" });
}

export function verifyAdminToken(token: string) {
  return jwt.verify(token, env.adminJwtSecret) as AdminTokenPayload;
}
