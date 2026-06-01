import assert from "node:assert/strict";

import type { CheckoutSessionResponse, LoginCustomerResponse } from "@otbt/types";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { listProducts } from "../apps/backend/src/modules/products/product.service.js";

const customerEmail = "customer@example.com";
const customerPassword = "password";
const smokeOrigin =
  process.env.STOREFRONT_SMOKE_ORIGIN ??
  `http://localhost:${process.env.NGINX_PORT ?? 80}`;
const apiBaseUrl = `${smokeOrigin}/api/storefront`;

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

const body = (await response.json()) as CheckoutSessionResponse & { error?: string };

assert.equal(response.status, 201, JSON.stringify(body));
assert.ok(body.orderId);
assert.ok(body.redirectUrl);
assert.ok(
  body.redirectUrl.startsWith("https://checkout.stripe.com/"),
  body.redirectUrl,
);

console.log(
  JSON.stringify(
    {
      ok: true,
      order: {
        id: body.orderId,
        redirectUrl: body.redirectUrl,
      },
      status: response.status,
    },
    null,
    2,
  ),
);
