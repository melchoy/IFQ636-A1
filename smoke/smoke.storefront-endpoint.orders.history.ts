import assert from "node:assert/strict";

import type { LoginCustomerResponse, OrderHistoryResponse } from "@otbt/types";

import { app } from "../apps/backend/src/app.js";
import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { CustomerModel } from "../apps/backend/src/modules/customers/customer.model.js";
import { registerCustomer } from "../apps/backend/src/modules/customers/customer.service.js";
import { OrderModel } from "../apps/backend/src/modules/orders/order.model.js";
import { createCheckoutOrder } from "../apps/backend/src/modules/orders/order.service.js";
import { listProducts } from "../apps/backend/src/modules/products/product.service.js";

await connectDatabase(env.mongodbUri);

const server = app.listen(0);
const now = Date.now();
const email = `smoke-orders-history-${now}@example.com`;
const otherEmail = `smoke-orders-history-other-${now}@example.com`;
const password = "password";

try {
  const address = server.address();
  assert.ok(address && typeof address === "object", "expected local server address");

  const baseUrl = `http://127.0.0.1:${address.port}`;

  const products = await listProducts({
    status: "active",
    visibility: "public",
  });
  const product = products[0];

  assert.ok(product, "Expected at least one active public product");

  const customer = await registerCustomer({
    firstName: "Smoke",
    lastName: "Orders",
    email,
    password,
  });

  const otherCustomer = await registerCustomer({
    firstName: "Smoke",
    lastName: "Other Orders",
    email: otherEmail,
    password,
  });

  const includedOrder = await createCheckoutOrder({
    customer: {
      customerId: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
    },
    deliveryAddress: {
      recipientName: "Smoke Orders",
      addressLine1: "1 Endpoint Street",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
    },
    items: [{ productId: product.id, quantity: 1 }],
  });

  const excludedOrder = await createCheckoutOrder({
    customer: {
      customerId: otherCustomer.id,
      firstName: otherCustomer.firstName,
      lastName: otherCustomer.lastName,
      email: otherCustomer.email,
    },
    deliveryAddress: {
      recipientName: "Smoke Other Orders",
      addressLine1: "2 Endpoint Street",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
    },
    items: [{ productId: product.id, quantity: 1 }],
  });

  const loginResponse = await fetch(`${baseUrl}/api/storefront/auth/login`, {
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
    method: "POST",
  });
  const loginBody = (await loginResponse.json()) as LoginCustomerResponse;

  const historyResponse = await fetch(`${baseUrl}/api/storefront/orders`, {
    headers: { Authorization: `Bearer ${loginBody.token}` },
  });
  const historyBody = (await historyResponse.json()) as OrderHistoryResponse;

  const unauthenticatedResponse = await fetch(
    `${baseUrl}/api/storefront/orders`,
  );
  const unauthenticatedBody = await unauthenticatedResponse.json();

  assert.equal(loginResponse.status, 200);
  assert.equal(historyResponse.status, 200);
  assert.equal(unauthenticatedResponse.status, 401);
  assert.ok(
    historyBody.orders.some((order) => order.id === includedOrder.id),
    "Expected customer order in history response",
  );
  assert.equal(
    historyBody.orders.some((order) => order.id === excludedOrder.id),
    false,
    "Expected other customer order to be excluded",
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        historyStatus: historyResponse.status,
        unauthenticatedStatus: unauthenticatedResponse.status,
        unauthenticatedBody,
        includedOrder: includedOrder.id,
        excludedOrder: excludedOrder.id,
        orders: historyBody.orders.map((order) => ({
          reference: order.reference,
          status: order.status,
          total: order.total,
          itemCount: order.itemCount,
        })),
      },
      null,
      2,
    ),
  );
} finally {
  server.close();
  await OrderModel.deleteMany({
    "customer.email": { $in: [email, otherEmail] },
  }).exec();
  await CustomerModel.deleteMany({ email: { $in: [email, otherEmail] } }).exec();
  await disconnectDatabase();
}
