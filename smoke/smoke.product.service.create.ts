import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { ProductModel } from "../apps/backend/src/modules/products/product.model.js";
import { createProduct } from "../apps/backend/src/modules/products/product.service.js";

await connectDatabase(env.mongodbUri);

const sku = `SMOKE-CREATE-${Date.now()}`;
let createdProductId: string | undefined;

try {
  const product = await createProduct({
    name: "Smoke Create Product",
    sku,
    description: "Created by the product service smoke test.",
    price: 49,
    stock: 12,
    status: "draft",
    visibility: "hidden",
  });

  createdProductId = product.id;

  assert.ok(product.id, "expected created product id");
  assert.equal(product.name, "Smoke Create Product");
  assert.equal(product.sku, sku);
  assert.equal(product.status, "draft");
  assert.equal(product.visibility, "hidden");

  const persistedProduct = await ProductModel.findOne({ sku }).lean().exec();
  assert.ok(persistedProduct, "expected product to be persisted");

  console.log(
    JSON.stringify(
      {
        ok: true,
        product: {
          id: product.id,
          name: product.name,
          sku: product.sku,
          status: product.status,
          visibility: product.visibility,
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

  await disconnectDatabase();
}
