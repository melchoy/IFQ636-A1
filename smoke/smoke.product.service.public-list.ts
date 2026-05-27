import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { listProducts } from "../apps/backend/src/modules/products/product.service.js";

await connectDatabase(env.mongodbUri);

try {
  const allProducts = await listProducts();
  const publicProducts = await listProducts({
    status: "active",
    visibility: "public",
  });

  assert.ok(allProducts.length > 0, "expected seeded products");
  assert.ok(publicProducts.length > 0, "expected public products");

  assert.equal(
    publicProducts.every(
      (product) => product.status === "active" && product.visibility === "public",
    ),
    true,
    "expected only active public products",
  );

  const excludedProducts = allProducts.filter(
    (product) => product.status !== "active" || product.visibility !== "public",
  );

  assert.ok(
    excludedProducts.length > 0,
    "expected at least one seeded product to be excluded by public filters",
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        allProductCount: allProducts.length,
        publicProductCount: publicProducts.length,
        publicProducts: publicProducts.map((product) => ({
          name: product.name,
          sku: product.sku,
          status: product.status,
          visibility: product.visibility,
        })),
        excludedProducts: excludedProducts.map((product) => ({
          name: product.name,
          sku: product.sku,
          status: product.status,
          visibility: product.visibility,
        })),
      },
      null,
      2,
    ),
  );
} finally {
  await disconnectDatabase();
}
