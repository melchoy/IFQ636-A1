import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import {
  getProduct,
  listProducts,
  updateProduct,
} from "../apps/backend/src/modules/products/product.service.js";

await connectDatabase(env.mongodbUri);

try {
  const products = await listProducts();
  const [seedProduct] = products;

  assert.ok(seedProduct, "expected at least one seeded product");

  const loadedProduct = await getProduct(seedProduct.id);
  assert.ok(loadedProduct, "expected product lookup by id to succeed");
  assert.equal(loadedProduct.id, seedProduct.id, "expected lookup to return selected product");

  const originalName = loadedProduct.name;
  const updatedName = `${originalName} 1`;
  const originalStock = loadedProduct.stock;
  const updatedStock = originalStock + 1;

  const updatedProduct = await updateProduct(loadedProduct.id, {
    name: updatedName,
    stock: updatedStock,
  });

  assert.ok(updatedProduct, "expected product update to succeed");
  assert.equal(updatedProduct.name, updatedName, "expected updated name to be returned");
  assert.equal(updatedProduct.stock, updatedStock, "expected updated stock to be returned");
  assert.equal("_id" in updatedProduct, false, "service DTO should not expose _id");

  const reloadedProduct = await getProduct(loadedProduct.id);
  assert.equal(reloadedProduct?.name, updatedName, "expected name update to persist");
  assert.equal(reloadedProduct?.stock, updatedStock, "expected update to persist");

  const missingProduct = await getProduct("000000000000000000000000");
  assert.equal(missingProduct, null, "expected missing product lookup to return null");

  const invalidProduct = await updateProduct("not-a-product-id", {
    stock: originalStock,
  });
  assert.equal(invalidProduct, null, "expected invalid product id update to return null");

  await updateProduct(loadedProduct.id, {
    name: originalName,
    stock: originalStock,
  });

  const restoredProduct = await getProduct(loadedProduct.id);
  assert.equal(restoredProduct?.name, originalName, "expected name to be restored");
  assert.equal(restoredProduct?.stock, originalStock, "expected stock to be restored");

  console.log(
    JSON.stringify(
      {
        ok: true,
        before: {
          id: loadedProduct.id,
          name: originalName,
          sku: loadedProduct.sku,
          stock: originalStock,
        },
        afterEdit: {
          id: updatedProduct.id,
          name: updatedProduct.name,
          sku: updatedProduct.sku,
          stock: updatedProduct.stock,
        },
      },
      null,
      2,
    ),
  );
} finally {
  await disconnectDatabase();
}
