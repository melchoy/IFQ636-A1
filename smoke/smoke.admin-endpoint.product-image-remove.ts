import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import path from "node:path";

import { app } from "../apps/backend/src/app.js";
import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import {
  clearProductImage,
  updateProduct,
} from "../apps/backend/src/modules/products/product.service.js";

type LoginResponse = {
  token?: string;
};

type ProductsResponse = {
  products?: { id?: string; name?: string; sku?: string; imageUrl?: string }[];
};

type ProductResponse = {
  product?: { id?: string; name?: string; sku?: string; imageUrl?: string };
};

type UploadResponse = {
  imageUrl?: string;
};

await connectDatabase(env.mongodbUri);

const server = app.listen(0);
let productId: string | undefined;
let originalImageUrl: string | undefined;
let uploadedImageUrl: string | undefined;

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

  const authHeaders = { Authorization: `Bearer ${loginBody.token}` };

  const productsResponse = await fetch(`${baseUrl}/api/admin/products`, {
    headers: authHeaders,
  });

  assert.equal(productsResponse.status, 200, "expected product list request to succeed");

  const productsBody = (await productsResponse.json()) as ProductsResponse;
  const [seedProduct] = productsBody.products ?? [];
  assert.ok(seedProduct?.id, "expected at least one seeded product");

  productId = seedProduct.id;
  originalImageUrl = seedProduct.imageUrl;

  const imageBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const formData = new FormData();
  formData.set("image", new Blob([imageBytes], { type: "image/png" }), "remove-smoke.png");

  const uploadResponse = await fetch(`${baseUrl}/api/admin/products/${productId}/images`, {
    method: "POST",
    headers: authHeaders,
    body: formData,
  });

  assert.equal(uploadResponse.status, 201, "expected image upload to succeed");

  const uploadBody = (await uploadResponse.json()) as UploadResponse;
  assert.match(uploadBody.imageUrl ?? "", /^\/uploads\/products\/.+\.png$/);

  uploadedImageUrl = uploadBody.imageUrl;

  const uploadedImagePath = path.join(env.uploadsDir, uploadedImageUrl!.replace("/uploads/", ""));
  await access(uploadedImagePath);

  await updateProduct(productId, { imageUrl: uploadedImageUrl });

  const removeResponse = await fetch(`${baseUrl}/api/admin/products/${productId}/image`, {
    method: "DELETE",
    headers: authHeaders,
  });

  assert.equal(removeResponse.status, 200, "expected image removal to succeed");

  const removeBody = (await removeResponse.json()) as ProductResponse;
  assert.equal(removeBody.product?.id, productId, "expected same product to be returned");
  assert.equal(removeBody.product?.imageUrl, undefined, "expected imageUrl to be cleared");

  await assert.rejects(access(uploadedImagePath), "expected uploaded file to be deleted");

  console.log(
    JSON.stringify(
      {
        ok: true,
        product: {
          id: removeBody.product?.id,
          name: removeBody.product?.name,
          sku: removeBody.product?.sku,
        },
        removedImageUrl: uploadedImageUrl,
      },
      null,
      2,
    ),
  );
} finally {
  if (productId) {
    if (originalImageUrl) {
      await updateProduct(productId, { imageUrl: originalImageUrl });
    } else {
      await clearProductImage(productId);
    }
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
