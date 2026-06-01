import { isValidObjectId } from "mongoose";

import type {
  CheckoutRequest,
  CheckoutSessionResponse,
  Order,
  OrderCreate,
  OrderHistoryItem,
  OrderItem,
} from "@otbt/types";

import { sendEmail } from "../email/email.service.js";
import {
  escapeHtml,
  renderRegisteredEmailTemplate,
} from "../email/email.templates.js";
import {
  createCheckoutSession,
  verifyCheckoutSession,
} from "../payments/payment.service.js";
import { ProductModel } from "../products/product.model.js";
import { orderEmailRegistry } from "./emails/email.registry.js";
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
    payment: order.payment,
    subtotal: order.subtotal,
    total: order.total,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

function serializeOrderHistoryItem(order: OrderRecord): OrderHistoryItem {
  const id = order._id.toString();
  const itemNames = order.items.map((item) => item.name);
  const remainingItemCount = Math.max(0, itemNames.length - 2);
  const itemSummary =
    remainingItemCount > 0
      ? `${itemNames.slice(0, 2).join(", ")} +${remainingItemCount} more`
      : itemNames.join(", ");

  return {
    id,
    reference: id,
    status: order.status,
    total: order.total,
    itemCount: order.items.reduce((total, item) => total + item.quantity, 0),
    itemSummary,
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

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-AU", {
    currency: "AUD",
    style: "currency",
  }).format(amount);
}

function formatStatus(status: Order["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatItemSummary(order: Order) {
  return order.items
    .map((item) => `${item.quantity} x ${item.name}`)
    .join(", ");
}

function formatDeliveryAddress(order: Order) {
  return [
    order.deliveryAddress.addressLine1,
    order.deliveryAddress.addressLine2,
    order.deliveryAddress.suburb,
    order.deliveryAddress.state,
    order.deliveryAddress.postcode,
  ]
    .filter(Boolean)
    .join(", ");
}

function getTotalItemCount(order: Order) {
  return order.items.reduce((total, item) => total + item.quantity, 0);
}

function resolveEmailImageUrl(imageUrl: string | null) {
  if (!imageUrl) {
    return null;
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  if (!imageUrl.startsWith("/")) {
    return null;
  }

  const assetOrigin =
    process.env.EMAIL_ASSET_ORIGIN ??
    (process.env.NGINX_PORT ? `http://localhost:${process.env.NGINX_PORT}` : undefined);

  return assetOrigin ? `${assetOrigin}${imageUrl}` : null;
}

function resolveStorefrontUrl(pathname: string) {
  const storefrontOrigin =
    process.env.STOREFRONT_ORIGIN ??
    (process.env.NGINX_PORT ? `http://localhost:${process.env.NGINX_PORT}` : undefined);

  return storefrontOrigin ? `${storefrontOrigin}${pathname}` : pathname;
}

function renderOrderItemImage(item: OrderItem) {
  const imageUrl = resolveEmailImageUrl(item.imageUrl);

  const imageContent = imageUrl
    ? `
            <img src="${escapeHtml(imageUrl)}" width="44" height="44" alt="${escapeHtml(item.name)}" style="display:block;width:44px;height:44px;border:0;object-fit:cover;border-radius:6px;" />
          `
    : `
            <span style="display:block;width:44px;height:44px;border-radius:6px;background-color:#211d25;"></span>
          `;

  return `
    <td width="48" valign="middle" style="width:48px;padding:0 12px 0 0;">
      <table role="presentation" width="48" height="48" cellspacing="0" cellpadding="0" bgcolor="#18151d" style="width:48px;height:48px;border-collapse:separate;border-spacing:0;background-color:#18151d;border:1px solid #2b2630;border-radius:7px;">
        <tr>
          <td align="center" valign="middle" style="padding:1px;">
            ${imageContent}
          </td>
        </tr>
      </table>
    </td>
  `;
}

function renderOrderItemRows(order: Order) {
  return order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:0 0 10px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
              <tr>
                ${renderOrderItemImage(item)}
                <td valign="middle" style="padding:0;">
                  <p style="margin:0 0 2px;font-size:12px;line-height:17px;font-weight:700;color:#f2ede3;">
                    ${escapeHtml(item.name)}
                  </p>
                  <p style="margin:0;font-size:11px;line-height:16px;color:#a79f94;">
                    Qty ${item.quantity} &middot; SKU ${escapeHtml(item.sku)}
                  </p>
                </td>
                <td align="right" valign="middle" style="padding:0 0 0 12px;font-size:12px;line-height:17px;font-weight:700;color:#f2ede3;white-space:nowrap;">
                  ${formatCurrency(item.lineTotal)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `,
    )
    .join("");
}

async function sendOrderConfirmationEmail(order: Order) {
  try {
    const renderedEmail = await renderRegisteredEmailTemplate({
      emailType: "Order placed",
      preheader: `We have received order ${order.id}.`,
      subject: `Order confirmation ${order.id}`,
      template: orderEmailRegistry.orderConfirmation,
      htmlValues: {
        orderItemsHtml: renderOrderItemRows(order),
      },
      values: {
        customerFirstName: order.customer.firstName,
        deliveryAddress: formatDeliveryAddress(order),
        deliveryWindow: "Local delivery details to be confirmed",
        itemCount: String(getTotalItemCount(order)),
        itemSummary: formatItemSummary(order),
        orderLink: resolveStorefrontUrl(`/orders/${order.id}`),
        orderReference: order.id,
        orderStatus: formatStatus(order.status),
        orderTotal: formatCurrency(order.total),
      },
    });

    return await sendEmail({
      ...renderedEmail,
      to: order.customer.email,
    });
  } catch (error) {
    console.error("Failed to send order confirmation email", error);

    return {
      reason: "Order confirmation email failed",
      status: "skipped" as const,
    };
  }
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
    payment: null,
    status: "pending",
    subtotal,
    total: subtotal,
  };

  const createdOrder = await OrderModel.create(order);
  const serializedOrder = serializeOrder(createdOrder as OrderRecord);

  await sendOrderConfirmationEmail(serializedOrder);

  return serializedOrder;
}

function getStripePaymentIntentId(
  paymentIntent: string | { id: string } | null,
) {
  if (!paymentIntent) {
    return null;
  }

  return typeof paymentIntent === "string" ? paymentIntent : paymentIntent.id;
}

function getOrderOrThrow(order: OrderRecord | null) {
  if (!order) {
    throw new OrderValidationError("Order not found");
  }

  return order;
}

export async function createCheckoutSessionForOrder(
  input: CheckoutRequest,
  customerId: string | null,
  origin: string,
): Promise<CheckoutSessionResponse> {
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
    payment: {
      amount: subtotal,
      checkoutSessionId: null,
      currency: "aud",
      paymentIntentId: null,
      provider: "stripe",
      status: "pending",
    },
    status: "pending",
    subtotal,
    total: subtotal,
  };

  const createdOrder = await OrderModel.create(order);
  const orderId = createdOrder._id.toString();
  const encodedOrderId = encodeURIComponent(orderId);
  const checkoutSession = await createCheckoutSession({
    cancelUrl: `${origin}/api/storefront/orders/checkout/stripe/cancel?orderId=${encodedOrderId}`,
    customerEmail: input.customer.email,
    items,
    orderId,
    successUrl: `${origin}/api/storefront/orders/checkout/stripe/success?orderId=${encodedOrderId}&session_id={CHECKOUT_SESSION_ID}`,
  });

  if (!checkoutSession.url) {
    throw new OrderValidationError("Unable to create checkout session");
  }

  await OrderModel.updateOne(
    { _id: orderId },
    { $set: { "payment.checkoutSessionId": checkoutSession.id } },
  ).exec();

  return {
    orderId,
    redirectUrl: checkoutSession.url,
  };
}

export async function confirmStripeCheckoutOrder(
  orderId: string,
  sessionId: string,
): Promise<Order> {
  if (!isValidObjectId(orderId) || !sessionId.trim()) {
    throw new OrderValidationError("Invalid checkout confirmation");
  }

  const existingOrder = getOrderOrThrow(
    (await OrderModel.findById(orderId).exec()) as OrderRecord | null,
  );

  if (existingOrder.payment?.status === "paid") {
    return serializeOrder(existingOrder);
  }

  if (
    existingOrder.payment?.checkoutSessionId &&
    existingOrder.payment.checkoutSessionId !== sessionId
  ) {
    throw new OrderValidationError("Invalid checkout session");
  }

  const checkoutSession = await verifyCheckoutSession({
    expectedTotal: existingOrder.total,
    orderId,
    sessionId,
  });

  const updatedOrder = getOrderOrThrow(
    (await OrderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          payment: {
            amount: checkoutSession.amount_total
              ? checkoutSession.amount_total / 100
              : existingOrder.total,
            checkoutSessionId: checkoutSession.id,
            currency: "aud",
            paymentIntentId: getStripePaymentIntentId(
              checkoutSession.payment_intent,
            ),
            provider: "stripe",
            status: "paid",
          },
        },
      },
      { new: true, runValidators: true },
    ).exec()) as OrderRecord | null,
  );
  const serializedOrder = serializeOrder(updatedOrder);

  await sendOrderConfirmationEmail(serializedOrder);

  return serializedOrder;
}

export async function markStripeCheckoutCancelled(orderId: string) {
  if (!isValidObjectId(orderId)) {
    throw new OrderValidationError("Invalid checkout cancellation");
  }

  await OrderModel.updateOne(
    { _id: orderId, "payment.status": "pending" },
    { $set: { "payment.status": "failed" } },
  ).exec();
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

export async function getOrderForCustomer(
  orderId: string,
  customerId: string,
): Promise<Order | null> {
  if (!isValidObjectId(orderId) || !customerId.trim()) {
    return null;
  }

  const order = await OrderModel.findOne({
    _id: orderId,
    "customer.customerId": customerId,
  }).exec();

  return order ? serializeOrder(order as OrderRecord) : null;
}
