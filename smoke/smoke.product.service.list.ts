import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { listProducts } from "../apps/backend/src/modules/products/product.service.js";

await connectDatabase(env.mongodbUri);

try {
  const products = await listProducts();

  assert.equal(products.length, 12, "expected 12 seeded products");

  const [firstProduct] = products;
  assert.ok(firstProduct, "expected at least one product");
  assert.equal(typeof firstProduct.id, "string", "expected product id");
  assert.equal(typeof firstProduct.name, "string", "expected product name");
  assert.equal(typeof firstProduct.sku, "string", "expected product sku");
  assert.equal(typeof firstProduct.price, "number", "expected product price");
  assert.equal(typeof firstProduct.stock, "number", "expected product stock");
  assert.equal(typeof firstProduct.status, "string", "expected product status");
  assert.equal(typeof firstProduct.visibility, "string", "expected product visibility");
  assert.equal("_id" in firstProduct, false, "service DTO should not expose _id");

  const sortedNames = [...products.map((product) => product.name)].sort((a, b) =>
    a.localeCompare(b),
  );
  assert.deepEqual(
    products.map((product) => product.name),
    sortedNames,
    "expected products to be sorted by name",
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        count: products.length,
        firstProduct: {
          id: firstProduct.id,
          name: firstProduct.name,
          sku: firstProduct.sku,
          status: firstProduct.status,
          visibility: firstProduct.visibility,
        },
        products: products.map((product) => ({
          name: product.name,
          sku: product.sku,
        })),
      },
      null,
      2,
    ),
  );
} finally {
  await disconnectDatabase();
}
