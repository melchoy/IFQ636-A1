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
const email = `smoke-auth-context-${Date.now()}@example.com`;

try {
  const address = server.address();
  assert.ok(address && typeof address === "object", "expected local server address");

  const baseUrl = `http://127.0.0.1:${address.port}`;

  await registerCustomer({
    firstName: "Smoke",
    lastName: "Auth Context",
    email,
    password: "password",
  });

  const loginResponse = await fetch(`${baseUrl}/api/storefront/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password: "password" }),
  });
  const loginBody = await loginResponse.json();

  const validMeResponse = await fetch(`${baseUrl}/api/storefront/auth/me`, {
    headers: { Authorization: `Bearer ${loginBody.token}` },
  });
  const validMeBody = await validMeResponse.json();

  const missingTokenResponse = await fetch(`${baseUrl}/api/storefront/auth/me`);
  const missingTokenBody = await missingTokenResponse.json();

  const invalidTokenResponse = await fetch(`${baseUrl}/api/storefront/auth/me`, {
    headers: { Authorization: "Bearer invalid-token" },
  });
  const invalidTokenBody = await invalidTokenResponse.json();

  assert.equal(loginResponse.status, 200);
  assert.equal(validMeResponse.status, 200);
  assert.equal(validMeBody.customer.email, email);
  assert.equal(missingTokenResponse.status, 401);
  assert.equal(missingTokenBody.error, "Not authorized");
  assert.equal(invalidTokenResponse.status, 401);
  assert.equal(invalidTokenBody.error, "Not authorized");

  console.log(
    JSON.stringify(
      {
        ok: true,
        validSession: {
          status: validMeResponse.status,
          customer: validMeBody.customer,
        },
        missingSession: {
          status: missingTokenResponse.status,
          body: missingTokenBody,
        },
        invalidSession: {
          status: invalidTokenResponse.status,
          body: invalidTokenBody,
        },
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
