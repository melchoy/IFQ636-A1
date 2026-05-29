import type {
  CurrentCustomerResponse,
  LoginCustomerDto,
  LoginCustomerResponse,
} from "@otbt/types";
import { Router } from "express";

import { HttpError } from "../../middleware/error-handler.js";
import {
  requireCustomer,
  type CustomerAuthRequest,
} from "../../middleware/require-customer.js";
import { findCustomerByCredentials } from "../../modules/customers/customer.service.js";
import { generateCustomerToken } from "../../modules/customers/customer.tokens.js";

export const storefrontAuthRouter = Router();

storefrontAuthRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body as Partial<LoginCustomerDto>;

    if (!email || !password) {
      throw new HttpError(400, "Email and password are required");
    }

    const customer = await findCustomerByCredentials(email, password);

    if (!customer) {
      throw new HttpError(401, "Invalid customer credentials");
    }

    const response: LoginCustomerResponse = {
      customer,
      token: generateCustomerToken({ id: customer.id, email: customer.email }),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

storefrontAuthRouter.get(
  "/me",
  requireCustomer,
  (req: CustomerAuthRequest, res, next) => {
    try {
      if (!req.customer) {
        throw new HttpError(401, "Not authorized");
      }

      const response: CurrentCustomerResponse = { customer: req.customer };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

storefrontAuthRouter.post("/logout", requireCustomer, (_req, res) => {
  res.status(204).send();
});
