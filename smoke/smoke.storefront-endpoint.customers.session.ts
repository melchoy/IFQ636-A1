import assert from "node:assert/strict";

import { app } from "../apps/backend/src/app.js";
import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { CustomerModel } from "../apps/backend/src/modules/customers/customer.model.js";
import { registerCustomer } from "../apps/backend/src/modules/customers/customer.service.js";

await connectDatabase(env.mongodbUri);

const server = app.listen(0);
const email = `smoke-customer-session-endpoint-${Date.now()}@example.com`;

try {
  const address = server.address();
  assert.ok(address && typeof address === "object", "expected local server address");

  const baseUrl = `http://127.0.0.1:${address.port}`;

  await registerCustomer({
    firstName: "Smoke",
    lastName: "Session Endpoint",
    email,
    password: "password",
  });

  const loginResponse = await fetch(`${baseUrl}/api/storefront/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "password" }),
  });
  const loginBody = await loginResponse.json();

  const meResponse = await fetch(`${baseUrl}/api/storefront/auth/me`, {
    headers: { Authorization: `Bearer ${loginBody.token}` },
  });
  const meBody = await meResponse.json();

  const unauthenticatedMeResponse = await fetch(
    `${baseUrl}/api/storefront/auth/me`,
  );

  const invalidLoginResponse = await fetch(`${baseUrl}/api/storefront/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "wrong-password" }),
  });

  const logoutResponse = await fetch(`${baseUrl}/api/storefront/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${loginBody.token}` },
  });

  assert.equal(loginResponse.status, 200);
  assert.equal(meResponse.status, 200);
  assert.equal(unauthenticatedMeResponse.status, 401);
  assert.equal(invalidLoginResponse.status, 401);
  assert.equal(logoutResponse.status, 204);
  assert.equal(loginBody.customer.email, email);
  assert.equal(meBody.customer.email, email);

  console.log(
    JSON.stringify(
      {
        ok: true,
        loginStatus: loginResponse.status,
        customer: loginBody.customer,
        meStatus: meResponse.status,
        meCustomer: meBody.customer,
        unauthenticatedMeStatus: unauthenticatedMeResponse.status,
        invalidLoginStatus: invalidLoginResponse.status,
        logoutStatus: logoutResponse.status,
      },
      null,
      2,
    ),
  );
} finally {
  server.close();
  await CustomerModel.deleteOne({ email }).exec();
  await disconnectDatabase();
}
