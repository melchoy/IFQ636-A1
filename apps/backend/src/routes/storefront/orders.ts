import type {
  CheckoutRequest,
  CheckoutSessionResponse,
  OrderDetailResponse,
  OrderHistoryResponse,
} from "@otbt/types";
import { Router } from "express";

import { HttpError } from "../../middleware/error-handler.js";
import {
  requireCustomer,
  type CustomerAuthRequest,
} from "../../middleware/require-customer.js";
import {
  confirmStripeCheckoutOrder,
  createCheckoutSessionForOrder,
  getOrderForCustomer,
  listOrdersForCustomer,
  markStripeCheckoutCancelled,
  OrderValidationError,
} from "../../modules/orders/order.service.js";
import { PaymentValidationError } from "../../modules/payments/payment.service.js";

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

function getOrderIdParam(orderId: string | string[]) {
  return Array.isArray(orderId) ? orderId[0] : orderId;
}

function getStringQuery(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function resolvePublicOrigin(req: CustomerAuthRequest) {
  const requestOrigin = getStringQuery(req.headers.origin);

  if (requestOrigin) {
    return requestOrigin;
  }

  const forwardedProto = getStringQuery(req.headers["x-forwarded-proto"])
    ?.split(",")[0]
    ?.trim();
  const forwardedHost = getStringQuery(req.headers["x-forwarded-host"])
    ?.split(",")[0]
    ?.trim();
  const host = (forwardedHost ?? req.headers.host)?.split(",")[0]?.trim();

  if (!host) {
    throw new OrderValidationError("Unable to resolve checkout redirect host");
  }

  return `${forwardedProto ?? req.protocol}://${host}`;
}

storefrontOrdersRouter.get(
  "/",
  requireCustomer,
  async (req: CustomerAuthRequest, res, next) => {
    try {
      if (!req.customer) {
        throw new HttpError(401, "Not authorized");
      }

      const response: OrderHistoryResponse = {
        orders: await listOrdersForCustomer(req.customer.id),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

storefrontOrdersRouter.get(
  "/checkout/stripe/success",
  async (req: CustomerAuthRequest, res, next) => {
    try {
      const orderId = getStringQuery(req.query.orderId);
      const sessionId = getStringQuery(req.query.session_id);

      if (!isPresentString(orderId) || !isPresentString(sessionId)) {
        throw new OrderValidationError("Invalid checkout confirmation");
      }

      const order = await confirmStripeCheckoutOrder(orderId, sessionId);

      res.redirect(
        `/checkout?payment=success&orderId=${encodeURIComponent(order.id)}`,
      );
    } catch (error) {
      if (
        error instanceof OrderValidationError ||
        error instanceof PaymentValidationError
      ) {
        next(new HttpError(400, error.message));
        return;
      }

      next(error);
    }
  },
);

storefrontOrdersRouter.get(
  "/checkout/stripe/cancel",
  async (req: CustomerAuthRequest, res, next) => {
    try {
      const orderId = getStringQuery(req.query.orderId);

      if (!isPresentString(orderId)) {
        throw new OrderValidationError("Invalid checkout cancellation");
      }

      await markStripeCheckoutCancelled(orderId);

      res.redirect(
        `/checkout?payment=cancelled&orderId=${encodeURIComponent(orderId)}`,
      );
    } catch (error) {
      if (error instanceof OrderValidationError) {
        next(new HttpError(400, error.message));
        return;
      }

      next(error);
    }
  },
);

storefrontOrdersRouter.get(
  "/:orderId",
  requireCustomer,
  async (req: CustomerAuthRequest, res, next) => {
    try {
      if (!req.customer) {
        throw new HttpError(401, "Not authorized");
      }

      const orderId = getOrderIdParam(req.params.orderId);
      const order = await getOrderForCustomer(orderId, req.customer.id);

      if (!order) {
        throw new HttpError(404, "Order not found");
      }

      const response: OrderDetailResponse = { order };

      res.json(response);
    } catch (error) {
      next(error);
    }
  },
);

storefrontOrdersRouter.post(
  "/checkout",
  async (req: CustomerAuthRequest, res, next) => {
    try {
      const checkoutRequest = parseCheckoutRequest(req.body);
      const response: CheckoutSessionResponse = await createCheckoutSessionForOrder(
        checkoutRequest,
        req.customer?.id ?? null,
        resolvePublicOrigin(req),
      );

      res.status(201).json(response);
    } catch (error) {
      if (
        error instanceof OrderValidationError ||
        error instanceof PaymentValidationError
      ) {
        next(new HttpError(400, error.message));
        return;
      }

      next(error);
    }
  },
);
