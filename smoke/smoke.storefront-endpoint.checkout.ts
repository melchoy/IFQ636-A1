import assert from "node:assert/strict";

import type { CheckoutResponse, LoginCustomerResponse } from "@otbt/types";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { listProducts } from "../apps/backend/src/modules/products/product.service.js";

const apiBaseUrl = "http://otbtstore.localhost/api/storefront";
const customerEmail = "customer@example.com";
const customerPassword = "password";

await connectDatabase(env.mongodbUri);

let product: Awaited<ReturnType<typeof listProducts>>[number] | undefined;

try {
  const products = await listProducts({
    status: "active",
    visibility: "public",
  });

  product = products[0];
  assert.ok(product, "Expected at least one active public product to checkout");
} finally {
  await disconnectDatabase();
}

const loginResponse = await fetch(`${apiBaseUrl}/auth/login`, {
  body: JSON.stringify({ email: customerEmail, password: customerPassword }),
  headers: { "Content-Type": "application/json" },
  method: "POST",
});
const loginBody = (await loginResponse.json()) as LoginCustomerResponse;

assert.equal(loginResponse.status, 200);

const response = await fetch(`${apiBaseUrl}/orders/checkout`, {
  body: JSON.stringify({
    customer: {
      firstName: "Example",
      lastName: "Customer",
      email: customerEmail,
    },
    deliveryAddress: {
      recipientName: "Example Customer",
      addressLine1: "1 Example Street",
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
    },
    items: [
      {
        productId: product.id,
        quantity: 2,
      },
    ],
  }),
  headers: {
    Authorization: `Bearer ${loginBody.token}`,
    "Content-Type": "application/json",
  },
  method: "POST",
});

const body = (await response.json()) as CheckoutResponse & { error?: string };

assert.equal(response.status, 201, JSON.stringify(body));
assert.ok(body.order.id);
assert.equal(body.order.customer.customerId, loginBody.customer.id);
assert.equal(body.order.customer.email, customerEmail);
assert.equal(body.order.items.length, 1);
assert.equal(body.order.items[0]?.productId, product.id);
assert.equal(body.order.items[0]?.quantity, 2);
assert.equal(body.order.status, "pending");

console.log(
  JSON.stringify(
    {
      ok: true,
      order: {
        id: body.order.id,
        customerId: body.order.customer.customerId,
        customerEmail: body.order.customer.email,
        itemCount: body.order.items.length,
        status: body.order.status,
        total: body.order.total,
      },
      status: response.status,
    },
    null,
    2,
  ),
);
