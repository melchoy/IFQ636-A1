import assert from "node:assert/strict";

import { app } from "../apps/backend/src/app.js";
import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { listProducts } from "../apps/backend/src/modules/products/product.service.js";

type ProductDetailResponse = {
  product?: {
    id?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    price?: number;
    stock?: number;
    sku?: string;
    status?: string;
    visibility?: string;
  };
};

await connectDatabase(env.mongodbUri);

const server = app.listen(0);

try {
  const address = server.address();
  assert.ok(address && typeof address === "object", "expected local server address");

  const products = await listProducts();
  const publicProduct = products.find(
    (product) => product.status === "active" && product.visibility === "public",
  );
  const excludedProduct = products.find(
    (product) => product.status !== "active" || product.visibility !== "public",
  );

  assert.ok(publicProduct, "expected seeded public product");
  assert.ok(excludedProduct, "expected seeded non-public or inactive product");

  const baseUrl = `http://127.0.0.1:${address.port}`;
  const detailResponse = await fetch(
    `${baseUrl}/api/storefront/products/${publicProduct.id}`,
  );
  const excludedResponse = await fetch(
    `${baseUrl}/api/storefront/products/${excludedProduct.id}`,
  );
  const invalidResponse = await fetch(`${baseUrl}/api/storefront/products/not-an-id`);

  assert.equal(detailResponse.status, 200, "expected public product detail request");
  assert.equal(excludedResponse.status, 404, "expected excluded product to be hidden");
  assert.equal(invalidResponse.status, 404, "expected invalid product id to be hidden");

  const detailBody = (await detailResponse.json()) as ProductDetailResponse;
  const excludedBody = await excludedResponse.json();
  const invalidBody = await invalidResponse.json();

  assert.equal(detailBody.product?.id, publicProduct.id);
  assert.equal(typeof detailBody.product?.name, "string", "expected product name");
  assert.equal(
    typeof detailBody.product?.description,
    "string",
    "expected product description",
  );
  assert.equal(typeof detailBody.product?.price, "number", "expected product price");
  assert.equal(typeof detailBody.product?.stock, "number", "expected product stock");
  assert.equal("sku" in detailBody.product, false, "public DTO should not expose sku");
  assert.equal("status" in detailBody.product, false, "public DTO should not expose status");
  assert.equal(
    "visibility" in detailBody.product,
    false,
    "public DTO should not expose visibility",
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        detailStatus: detailResponse.status,
        detailBody,
        excludedStatus: excludedResponse.status,
        excludedBody,
        invalidStatus: invalidResponse.status,
        invalidBody,
      },
      null,
      2,
    ),
  );
} finally {
  server.close();
  await disconnectDatabase();
}
