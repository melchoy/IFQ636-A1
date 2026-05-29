import jwt from "jsonwebtoken";

import { env } from "../../config/env.js";

export interface CustomerTokenPayload {
  id: string;
  email: string;
}

export function generateCustomerToken(payload: CustomerTokenPayload) {
  return jwt.sign(payload, env.adminJwtSecret, { expiresIn: "30d" });
}

export function verifyCustomerToken(token: string) {
  return jwt.verify(token, env.adminJwtSecret) as CustomerTokenPayload;
}
