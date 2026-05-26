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

type ProductsResponse = {
  products?: Array<{
    id?: string;
    name?: string;
    sku?: string;
    price?: number;
    stock?: number;
    status?: string;
    visibility?: string;
  }>;
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

  const productsResponse = await fetch(`${baseUrl}/api/admin/products`, {
    headers: { Authorization: `Bearer ${loginBody.token}` },
  });

  assert.equal(productsResponse.status, 200, "expected authenticated products request");

  const productsBody = (await productsResponse.json()) as ProductsResponse;
  assert.equal(productsBody.products?.length, 12, "expected 12 products");

  const [firstProduct] = productsBody.products ?? [];
  assert.ok(firstProduct, "expected at least one product");
  assert.equal(typeof firstProduct.id, "string", "expected product id");
  assert.equal(typeof firstProduct.name, "string", "expected product name");
  assert.equal(typeof firstProduct.sku, "string", "expected product sku");
  assert.equal(typeof firstProduct.price, "number", "expected product price");
  assert.equal(typeof firstProduct.stock, "number", "expected product stock");
  assert.equal(typeof firstProduct.status, "string", "expected product status");
  assert.equal(typeof firstProduct.visibility, "string", "expected product visibility");

  const unauthenticatedResponse = await fetch(`${baseUrl}/api/admin/products`);
  assert.equal(unauthenticatedResponse.status, 401, "expected unauthenticated request to fail");

  console.log(
    JSON.stringify(
      {
        ok: true,
        authenticatedStatus: productsResponse.status,
        unauthenticatedStatus: unauthenticatedResponse.status,
        count: productsBody.products.length,
        products: productsBody.products.map((product) => ({
          name: product.name,
          sku: product.sku,
        })),
      },
      null,
      2,
    ),
  );
} finally {
  server.close();
  await disconnectDatabase();
}
