import type {
  AdminCustomerDetailResponse,
  AdminCustomerListResponse,
  AdminCustomerUpdateRequest,
  AdminCustomerUpdateResponse,
} from "@otbt/types";
import { Router } from "express";
import { Error as MongooseError } from "mongoose";

import { HttpError } from "../../middleware/error-handler.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import {
  getCustomer,
  listCustomers,
  updateCustomer,
} from "../../modules/customers/customer.service.js";

export const adminCustomersRouter = Router();

function handleCustomerRouteError(error: unknown, next: (error: unknown) => void) {
  if (error instanceof MongooseError.ValidationError) {
    next(new HttpError(400, error.message));
    return;
  }

  next(error);
}

function getCustomerIdParam(customerId: string | string[]) {
  return Array.isArray(customerId) ? customerId[0] : customerId;
}

adminCustomersRouter.get("/", requireAdmin, async (_req, res, next) => {
  try {
    const customers = await listCustomers();
    const response: AdminCustomerListResponse = { customers };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

adminCustomersRouter.get("/:customerId", requireAdmin, async (req, res, next) => {
  try {
    const customerId = getCustomerIdParam(req.params.customerId);
    const customer = await getCustomer(customerId);

    if (!customer) {
      throw new HttpError(404, "Customer not found");
    }

    const response: AdminCustomerDetailResponse = { customer };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

adminCustomersRouter.patch("/:customerId", requireAdmin, async (req, res, next) => {
  try {
    const customerId = getCustomerIdParam(req.params.customerId);
    const customer = await updateCustomer(
      customerId,
      req.body as AdminCustomerUpdateRequest,
    );

    if (!customer) {
      throw new HttpError(404, "Customer not found");
    }

    const response: AdminCustomerUpdateResponse = { customer };

    res.json(response);
  } catch (error) {
    handleCustomerRouteError(error, next);
  }
});
