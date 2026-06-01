import type {
  AdminOrderDetailResponse,
  AdminOrderListResponse,
  AdminOrderStatusUpdateRequest,
  AdminOrderStatusUpdateResponse,
} from "@otbt/types";
import { Router } from "express";

import { HttpError } from "../../middleware/error-handler.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import {
  getAdminOrder,
  listAdminOrders,
  OrderValidationError,
  updateAdminOrderStatus,
} from "../../modules/orders/order.service.js";

export const adminOrdersRouter = Router();

function getOrderIdParam(orderId: string | string[]) {
  return Array.isArray(orderId) ? orderId[0] : orderId;
}

adminOrdersRouter.get("/", requireAdmin, async (_req, res, next) => {
  try {
    const response: AdminOrderListResponse = {
      orders: await listAdminOrders(),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

adminOrdersRouter.get("/:orderId", requireAdmin, async (req, res, next) => {
  try {
    const orderId = getOrderIdParam(req.params.orderId);
    const order = await getAdminOrder(orderId);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    const response: AdminOrderDetailResponse = { order };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

adminOrdersRouter.patch("/:orderId/status", requireAdmin, async (req, res, next) => {
  try {
    const orderId = getOrderIdParam(req.params.orderId);
    const { status } = req.body as Partial<AdminOrderStatusUpdateRequest>;

    if (!status) {
      throw new OrderValidationError("Order status is required");
    }

    const order = await updateAdminOrderStatus(orderId, status);

    if (!order) {
      throw new HttpError(404, "Order not found");
    }

    const response: AdminOrderStatusUpdateResponse = { order };

    res.json(response);
  } catch (error) {
    if (error instanceof OrderValidationError) {
      next(new HttpError(400, error.message));
      return;
    }

    next(error);
  }
});
