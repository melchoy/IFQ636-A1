import assert from "node:assert/strict";

import type {
  AdminOrderListResponse,
  AdminOrderStatusUpdateResponse,
  LoginAdminResponse,
  OrderStatus,
} from "@otbt/types";

const smokeOrigin =
  process.env.ADMIN_SMOKE_ORIGIN ??
  `http://localhost:${process.env.NGINX_PORT ?? 80}`;
const apiBaseUrl = `${smokeOrigin}/api/admin`;

const loginResponse = await fetch(`${apiBaseUrl}/auth/login`, {
  body: JSON.stringify({ email: "admin@example.com", password: "password" }),
  headers: { "Content-Type": "application/json" },
  method: "POST",
});
const loginBody = (await loginResponse.json()) as LoginAdminResponse;

assert.equal(loginResponse.status, 200, JSON.stringify(loginBody));

const listResponse = await fetch(`${apiBaseUrl}/orders`, {
  headers: { Authorization: `Bearer ${loginBody.token}` },
});
const listBody = (await listResponse.json()) as AdminOrderListResponse;
const order = listBody.orders[0];

assert.ok(order, "expected at least one order to update");

const nextStatus: OrderStatus =
  order.status === "packed" ? "pending" : "packed";

const updateResponse = await fetch(`${apiBaseUrl}/orders/${order.id}/status`, {
  body: JSON.stringify({ status: nextStatus }),
  headers: {
    Authorization: `Bearer ${loginBody.token}`,
    "Content-Type": "application/json",
  },
  method: "PATCH",
});
const updateBody = (await updateResponse.json()) as AdminOrderStatusUpdateResponse;

assert.equal(updateResponse.status, 200, JSON.stringify(updateBody));
assert.equal(updateBody.order.id, order.id);
assert.equal(updateBody.order.status, nextStatus);

const restoreResponse = await fetch(`${apiBaseUrl}/orders/${order.id}/status`, {
  body: JSON.stringify({ status: order.status }),
  headers: {
    Authorization: `Bearer ${loginBody.token}`,
    "Content-Type": "application/json",
  },
  method: "PATCH",
});

assert.equal(restoreResponse.status, 200, await restoreResponse.text());

console.log(
  JSON.stringify(
    {
      ok: true,
      orderId: order.id,
      restoredStatus: order.status,
      status: nextStatus,
    },
    null,
    2,
  ),
);
