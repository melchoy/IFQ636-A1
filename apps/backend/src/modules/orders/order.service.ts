import { isValidObjectId } from "mongoose";

import type {
  CheckoutRequest,
  Order,
  OrderCreate,
  OrderHistoryItem,
  OrderItem,
} from "@otbt/types";

import { ProductModel } from "../products/product.model.js";
import { OrderModel, type OrderDocument } from "./order.model.js";

type OrderRecord = OrderDocument & {
  _id: { toString(): string };
  createdAt: Date;
  updatedAt: Date;
};

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderValidationError";
  }
}

function serializeOrder(order: OrderRecord): Order {
  return {
    id: order._id.toString(),
    customer: order.customer,
    deliveryAddress: order.deliveryAddress,
    items: order.items,
    status: order.status,
    subtotal: order.subtotal,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

function serializeOrderHistoryItem(order: OrderRecord): OrderHistoryItem {
  const id = order._id.toString();

  return {
    id,
    reference: id,
    status: order.status,
    total: order.total,
    itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

function normalizeQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    throw new OrderValidationError("Invalid product quantity");
  }

  const normalizedQuantity = Math.floor(quantity);

  if (normalizedQuantity < 1) {
    throw new OrderValidationError("Invalid product quantity");
  }

  return normalizedQuantity;
}

async function buildOrderItems(
  items: CheckoutRequest["items"],
): Promise<OrderItem[]> {
  if (items.length === 0) {
    throw new OrderValidationError("Cart cannot be empty");
  }

  const requestedItems = items.map((item) => {
    if (!isValidObjectId(item.productId)) {
      throw new OrderValidationError("Cart contains an unavailable product");
    }

    return {
      productId: item.productId,
      quantity: normalizeQuantity(item.quantity),
    };
  });

  const products = await ProductModel.find({
    _id: { $in: requestedItems.map((item) => item.productId) },
    status: "active",
    visibility: "public",
  }).exec();

  return requestedItems.map((requestedItem) => {
    const product = products.find(
      (candidate) => candidate._id.toString() === requestedItem.productId,
    );

    if (!product) {
      throw new OrderValidationError("Cart contains an unavailable product");
    }

    return {
      productId: product._id.toString(),
      name: product.name,
      sku: product.sku,
      imageUrl: product.imageUrl ?? null,
      price: product.price,
      quantity: requestedItem.quantity,
      lineTotal: product.price * requestedItem.quantity,
    };
  });
}

export async function createCheckoutOrder(
  input: CheckoutRequest,
  customerId: string | null,
): Promise<Order> {
  const items = await buildOrderItems(input.items);
  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

  const order: OrderCreate = {
    customer: {
      customerId,
      firstName: input.customer.firstName,
      lastName: input.customer.lastName,
      email: input.customer.email,
      phone: input.customer.phone,
    },
    deliveryAddress: input.deliveryAddress,
    items,
    status: "pending",
    subtotal,
    total: subtotal,
  };

  const createdOrder = await OrderModel.create(order);

  return serializeOrder(createdOrder as OrderRecord);
}

export async function listOrdersForCustomer(
  customerId: string,
): Promise<OrderHistoryItem[]> {
  if (!customerId.trim()) {
    return [];
  }

  const orders = await OrderModel.find({ "customer.customerId": customerId })
    .sort({ createdAt: -1 })
    .exec();

  return orders.map((order) => serializeOrderHistoryItem(order as OrderRecord));
}
