import type { Customer } from "@otbt/types";
import type { NextFunction, Request, Response } from "express";

import { findCustomerById } from "../modules/customers/customer.service.js";
import { verifyCustomerToken } from "../modules/customers/customer.tokens.js";
import { HttpError } from "./error-handler.js";

export interface CustomerAuthRequest extends Request {
  customer?: Customer;
}

export async function requireCustomer(
  req: CustomerAuthRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new HttpError(401, "Not authorized"));
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    const payload = verifyCustomerToken(token);
    const customer = await findCustomerById(payload.id);

    if (!customer) {
      next(new HttpError(401, "Not authorized"));
      return;
    }

    req.customer = customer;
    next();
  } catch {
    next(new HttpError(401, "Not authorized"));
  }
}
