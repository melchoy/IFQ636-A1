import assert from "node:assert/strict";

import type {
  AdminOrderDetailResponse,
  AdminOrderListResponse,
  LoginAdminResponse,
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

assert.equal(listResponse.status, 200, JSON.stringify(listBody));
assert.ok(Array.isArray(listBody.orders));

if (listBody.orders[0]) {
  const detailResponse = await fetch(
    `${apiBaseUrl}/orders/${listBody.orders[0].id}`,
    {
      headers: { Authorization: `Bearer ${loginBody.token}` },
    },
  );
  const detailBody = (await detailResponse.json()) as AdminOrderDetailResponse;

  assert.equal(detailResponse.status, 200, JSON.stringify(detailBody));
  assert.equal(detailBody.order.id, listBody.orders[0].id);
}

console.log(
  JSON.stringify(
    {
      ok: true,
      orderCount: listBody.orders.length,
    },
    null,
    2,
  ),
);
