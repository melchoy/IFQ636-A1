import type { CheckoutRequest, CheckoutResponse } from "@otbt/types";
import { Router } from "express";

import { HttpError } from "../../middleware/error-handler.js";
import {
  createCheckoutOrder,
  OrderValidationError,
} from "../../modules/orders/order.service.js";

export const storefrontOrdersRouter = Router();

function isPresentString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseCheckoutRequest(body: unknown): CheckoutRequest {
  const input = body as Partial<CheckoutRequest>;

  if (!input.customer || !input.deliveryAddress || !Array.isArray(input.items)) {
    throw new OrderValidationError("Invalid checkout request");
  }

  if (
    !isPresentString(input.customer.firstName) ||
    !isPresentString(input.customer.lastName) ||
    !isPresentString(input.customer.email)
  ) {
    throw new OrderValidationError("Customer details are required");
  }

  if (
    !isPresentString(input.deliveryAddress.recipientName) ||
    !isPresentString(input.deliveryAddress.addressLine1) ||
    !isPresentString(input.deliveryAddress.suburb) ||
    !isPresentString(input.deliveryAddress.state) ||
    !isPresentString(input.deliveryAddress.postcode)
  ) {
    throw new OrderValidationError("Delivery address is required");
  }

  if (
    input.items.length === 0 ||
    input.items.some(
      (item) =>
        !isPresentString(item.productId) ||
        typeof item.quantity !== "number" ||
        item.quantity < 1,
    )
  ) {
    throw new OrderValidationError("Cart items are required");
  }

  return input as CheckoutRequest;
}

storefrontOrdersRouter.post("/checkout", async (req, res, next) => {
  try {
    const checkoutRequest = parseCheckoutRequest(req.body);
    const response: CheckoutResponse = {
      order: await createCheckoutOrder(checkoutRequest),
    };

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof OrderValidationError) {
      next(new HttpError(400, error.message));
      return;
    }

    next(error);
  }
});
