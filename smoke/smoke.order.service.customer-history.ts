import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import {
  createCheckoutOrder,
  listOrdersForCustomer,
} from "../apps/backend/src/modules/orders/order.service.js";
import { listProducts } from "../apps/backend/src/modules/products/product.service.js";

const now = Date.now();
const customerId = `smoke-history-customer-${now}`;
const otherCustomerId = `smoke-history-other-${now}`;

await connectDatabase(env.mongodbUri);

try {
  const products = await listProducts({
    status: "active",
    visibility: "public",
  });
  const product = products[0];

  assert.ok(product, "expected at least one public active product");

  const customerOrder = await createCheckoutOrder(
    {
      customer: {
        firstName: "Smoke",
        lastName: "History",
        email: `smoke-history-${now}@example.com`,
        phone: null,
      },
      deliveryAddress: {
        recipientName: "Smoke History",
        addressLine1: "1 Smoke Street",
        addressLine2: null,
        suburb: "Brisbane",
        state: "QLD",
        postcode: "4000",
        instructions: null,
      },
      items: [{ productId: product.id, quantity: 2 }],
    },
    customerId,
  );

  const otherCustomerOrder = await createCheckoutOrder(
    {
      customer: {
        firstName: "Other",
        lastName: "Customer",
        email: `smoke-history-other-${now}@example.com`,
        phone: null,
      },
      deliveryAddress: {
        recipientName: "Other Customer",
        addressLine1: "2 Smoke Street",
        addressLine2: null,
        suburb: "Brisbane",
        state: "QLD",
        postcode: "4000",
        instructions: null,
      },
      items: [{ productId: product.id, quantity: 1 }],
    },
    otherCustomerId,
  );

  const history = await listOrdersForCustomer(customerId);

  assert.ok(
    history.some((order) => order.id === customerOrder.id),
    "expected customer order to be included",
  );
  assert.ok(
    !history.some((order) => order.id === otherCustomerOrder.id),
    "expected another customer's order to be excluded",
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        customerId,
        includedOrder: customerOrder.id,
        excludedOrder: otherCustomerOrder.id,
        orders: history.map((order) => ({
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
  await disconnectDatabase();
}
