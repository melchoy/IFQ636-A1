import type { RegisterCustomerDto, RegisterCustomerResponse } from "@otbt/types";
import { Router } from "express";

import { HttpError } from "../../middleware/error-handler.js";
import { registerCustomer } from "../../modules/customers/customer.service.js";

export const storefrontCustomersRouter = Router();

storefrontCustomersRouter.post("/", async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } =
      req.body as Partial<RegisterCustomerDto>;

    if (!firstName || !lastName || !email || !password) {
      throw new HttpError(
        400,
        "First name, last name, email, and password are required",
      );
    }

    const response: RegisterCustomerResponse = {
      customer: await registerCustomer({
        firstName,
        lastName,
        email,
        password,
      }),
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});
