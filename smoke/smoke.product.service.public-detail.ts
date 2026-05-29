import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { getProduct, listProducts } from "../apps/backend/src/modules/products/product.service.js";

await connectDatabase(env.mongodbUri);

try {
  const products = await listProducts();
  const publicProduct = products.find(
    (product) => product.status === "active" && product.visibility === "public",
  );
  const excludedProduct = products.find(
    (product) => product.status !== "active" || product.visibility !== "public",
  );

  assert.ok(publicProduct, "expected seeded public product");
  assert.ok(excludedProduct, "expected seeded non-public or inactive product");

  const constrainedPublicProduct = await getProduct(publicProduct.id, {
    status: "active",
    visibility: "public",
  });
  const constrainedExcludedProduct = await getProduct(excludedProduct.id, {
    status: "active",
    visibility: "public",
  });
  const unrestrictedExcludedProduct = await getProduct(excludedProduct.id);

  assert.equal(constrainedPublicProduct?.id, publicProduct.id);
  assert.equal(constrainedExcludedProduct, null);
  assert.equal(unrestrictedExcludedProduct?.id, excludedProduct.id);

  console.log(
    JSON.stringify(
      {
        ok: true,
        constrainedPublicProduct,
        constrainedExcludedProduct,
      },
      null,
      2,
    ),
  );
} finally {
  await disconnectDatabase();
}
