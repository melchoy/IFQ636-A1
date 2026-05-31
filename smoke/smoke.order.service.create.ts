import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { createCheckoutOrder } from "../apps/backend/src/modules/orders/order.service.js";
import { listProducts } from "../apps/backend/src/modules/products/product.service.js";

await connectDatabase(env.mongodbUri);

try {
  const products = await listProducts({ status: "active", visibility: "public" });
  const product = products[0];

  assert.ok(product, "expected a public product for order smoke test");

  const order = await createCheckoutOrder({
    customer: {
      firstName: "Smoke",
      lastName: "Customer",
      email: "smoke.customer@example.com",
      phone: null,
    },
    deliveryAddress: {
      recipientName: "Smoke Customer",
      addressLine1: "1 Smoke Street",
      addressLine2: null,
      suburb: "Brisbane",
      state: "QLD",
      postcode: "4000",
      instructions: null,
    },
    items: [{ productId: product.id, quantity: 2 }],
  }, null);

  assert.ok(order.id, "expected created order id");
  assert.equal(order.customer.customerId, null);
  assert.equal(order.status, "pending");
  assert.equal(order.items.length, 1);
  assert.equal(order.items[0]?.productId, product.id);
  assert.equal(order.items[0]?.quantity, 2);
  assert.equal(order.items[0]?.lineTotal, product.price * 2);
  assert.equal(order.subtotal, product.price * 2);
  assert.equal(order.total, product.price * 2);

  console.log(
    JSON.stringify(
      {
        ok: true,
        order: {
          id: order.id,
          status: order.status,
          itemCount: order.items.length,
          subtotal: order.subtotal,
          total: order.total,
          firstItem: order.items[0],
        },
      },
      null,
      2,
    ),
  );
} finally {
  await disconnectDatabase();
}
