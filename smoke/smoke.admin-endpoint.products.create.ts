import assert from "node:assert/strict";

import { app } from "../apps/backend/src/app.js";
import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { ProductModel } from "../apps/backend/src/modules/products/product.model.js";

type LoginResponse = {
  token?: string;
};

type ProductResponse = {
  product?: {
    id?: string;
    name?: string;
    sku?: string;
    status?: string;
    visibility?: string;
  };
};

await connectDatabase(env.mongodbUri);

const server = app.listen(0);
const sku = `SMOKE-ENDPOINT-CREATE-${Date.now()}`;
let createdProductId: string | undefined;

try {
  const address = server.address();
  assert.ok(address && typeof address === "object", "expected local server address");

  const baseUrl = `http://127.0.0.1:${address.port}`;

  const loginResponse = await fetch(`${baseUrl}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@example.com", password: "password" }),
  });

  assert.equal(loginResponse.status, 200, "expected login to succeed");

  const loginBody = (await loginResponse.json()) as LoginResponse;
  assert.ok(loginBody.token, "expected login response to include token");

  const authHeaders = {
    Authorization: `Bearer ${loginBody.token}`,
    "Content-Type": "application/json",
  };

  const createResponse = await fetch(`${baseUrl}/api/admin/products`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "Smoke Endpoint Create Product",
      sku,
      description: "Created by the admin product creation endpoint smoke test.",
      price: 59,
      stock: 8,
      status: "draft",
      visibility: "hidden",
    }),
  });

  assert.equal(createResponse.status, 201, "expected product creation request to succeed");

  const createBody = (await createResponse.json()) as ProductResponse;
  createdProductId = createBody.product?.id;

  assert.ok(createdProductId, "expected created product id");
  assert.equal(createBody.product?.sku, sku);

  const invalidResponse = await fetch(`${baseUrl}/api/admin/products`, {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      name: "",
      sku: "",
      description: "",
      price: -1,
      stock: -1,
      status: "not-real",
      visibility: "hidden",
    }),
  });

  assert.equal(invalidResponse.status, 400, "expected invalid product creation to fail");

  const unauthenticatedResponse = await fetch(`${baseUrl}/api/admin/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "No Session" }),
  });

  assert.equal(unauthenticatedResponse.status, 401, "expected unauthenticated request to fail");

  console.log(
    JSON.stringify(
      {
        ok: true,
        checks: {
          authenticatedCreate: {
            expectedStatus: 201,
            actualStatus: createResponse.status,
            product: createBody.product,
          },
          invalidCreateRejected: {
            expectedStatus: 400,
            actualStatus: invalidResponse.status,
          },
          unauthenticatedCreateRejected: {
            expectedStatus: 401,
            actualStatus: unauthenticatedResponse.status,
          },
        },
      },
      null,
      2,
    ),
  );
} finally {
  if (createdProductId) {
    await ProductModel.findByIdAndDelete(createdProductId).exec();
  } else {
    await ProductModel.findOneAndDelete({ sku }).exec();
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  await disconnectDatabase();
}
