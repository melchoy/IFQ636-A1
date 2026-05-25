import assert from "node:assert/strict";

import { app } from "../apps/backend/src/app.js";
import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";

type LoginResponse = {
  token?: string;
};

type ProductResponse = {
  product?: {
    id?: string;
    name?: string;
    sku?: string;
    stock?: number;
  };
};

type ProductsResponse = {
  products?: NonNullable<ProductResponse["product"]>[];
};

await connectDatabase(env.mongodbUri);

const server = app.listen(0);

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

  const productsResponse = await fetch(`${baseUrl}/api/admin/products`, {
    headers: authHeaders,
  });
  assert.equal(productsResponse.status, 200, "expected product list request to succeed");

  const productsBody = (await productsResponse.json()) as ProductsResponse;
  const [seedProduct] = productsBody.products ?? [];
  assert.ok(seedProduct?.id, "expected a seeded product id");

  const detailResponse = await fetch(`${baseUrl}/api/admin/products/${seedProduct.id}`, {
    headers: authHeaders,
  });
  assert.equal(detailResponse.status, 200, "expected product detail request to succeed");

  const detailBody = (await detailResponse.json()) as ProductResponse;
  assert.ok(detailBody.product, "expected product detail response");

  const originalName = detailBody.product.name;
  const originalStock = detailBody.product.stock;
  assert.ok(originalName, "expected product name");
  assert.equal(typeof originalStock, "number", "expected product stock");

  const updatedName = `${originalName} 1`;
  const updatedStock = originalStock + 1;

  const updateResponse = await fetch(`${baseUrl}/api/admin/products/${seedProduct.id}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      name: updatedName,
      stock: updatedStock,
    }),
  });
  assert.equal(updateResponse.status, 200, "expected product update request to succeed");

  const updateBody = (await updateResponse.json()) as ProductResponse;
  assert.equal(updateBody.product?.name, updatedName, "expected updated name");
  assert.equal(updateBody.product?.stock, updatedStock, "expected updated stock");

  const unauthenticatedResponse = await fetch(`${baseUrl}/api/admin/products/${seedProduct.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: originalName }),
  });
  assert.equal(unauthenticatedResponse.status, 401, "expected unauthenticated update to fail");

  const missingResponse = await fetch(`${baseUrl}/api/admin/products/000000000000000000000000`, {
    headers: authHeaders,
  });
  assert.equal(missingResponse.status, 404, "expected missing product detail to return 404");

  const restoreResponse = await fetch(`${baseUrl}/api/admin/products/${seedProduct.id}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      name: originalName,
      stock: originalStock,
    }),
  });
  assert.equal(restoreResponse.status, 200, "expected restore update request to succeed");

  console.log(
    JSON.stringify(
      {
        ok: true,
        before: {
          id: seedProduct.id,
          name: originalName,
          stock: originalStock,
        },
        afterEdit: {
          id: updateBody.product?.id,
          name: updateBody.product?.name,
          stock: updateBody.product?.stock,
        },
        unauthenticatedStatus: unauthenticatedResponse.status,
        missingStatus: missingResponse.status,
      },
      null,
      2,
    ),
  );
} finally {
  server.close();
  await disconnectDatabase();
}
