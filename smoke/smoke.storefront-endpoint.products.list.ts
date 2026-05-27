import assert from "node:assert/strict";

import { app } from "../apps/backend/src/app.js";
import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";

type ProductsResponse = {
  products?: Array<{
    id?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    sku?: string;
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
  const productsResponse = await fetch(`${baseUrl}/api/storefront/products`);

  assert.equal(productsResponse.status, 200, "expected public products request");

  const productsBody = (await productsResponse.json()) as ProductsResponse;
  assert.ok(productsBody.products, "expected products response");
  assert.ok(productsBody.products.length > 0, "expected public products");

  for (const product of productsBody.products) {
    assert.equal(typeof product.id, "string", "expected product id");
    assert.equal(typeof product.name, "string", "expected product name");
    assert.equal(typeof product.description, "string", "expected product description");
    assert.equal(typeof product.price, "number", "expected product price");
    assert.equal("sku" in product, false, "public DTO should not expose sku");
    assert.equal("stock" in product, false, "public DTO should not expose stock");
    assert.equal("status" in product, false, "public DTO should not expose status");
    assert.equal("visibility" in product, false, "public DTO should not expose visibility");
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        status: productsResponse.status,
        count: productsBody.products.length,
        products: productsBody.products.map((product) => ({
          name: product.name,
          price: product.price,
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
