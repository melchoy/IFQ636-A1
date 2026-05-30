import assert from "node:assert/strict";

import { app } from "../apps/backend/src/app.js";
import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { CustomerModel } from "../apps/backend/src/modules/customers/customer.model.js";

await connectDatabase(env.mongodbUri);

const server = app.listen(0);
const email = `smoke-customer-endpoint-${Date.now()}@example.com`;

try {
  const address = server.address();
  assert.ok(address && typeof address === "object", "expected local server address");

  const baseUrl = `http://127.0.0.1:${address.port}`;
  const registrationBody = {
    firstName: "Smoke",
    lastName: "Endpoint",
    email,
    password: "password",
  };

  const response = await fetch(`${baseUrl}/api/storefront/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registrationBody),
  });
  const duplicateResponse = await fetch(`${baseUrl}/api/storefront/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(registrationBody),
  });
  const invalidResponse = await fetch(`${baseUrl}/api/storefront/customers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  assert.equal(response.status, 201);
  assert.equal(duplicateResponse.status, 409);
  assert.equal(invalidResponse.status, 400);

  const body = await response.json();

  console.log(
    JSON.stringify(
      {
        ok: true,
        createdStatus: response.status,
        createdBody: body,
        duplicateStatus: duplicateResponse.status,
        invalidStatus: invalidResponse.status,
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
