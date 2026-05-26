import assert from "node:assert/strict";
import { access, rm } from "node:fs/promises";
import path from "node:path";

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
  products?: { id?: string; name?: string; sku?: string }[];
};

type UploadResponse = {
  imageUrl?: string;
};

await connectDatabase(env.mongodbUri);

const server = app.listen(0);
let uploadedImagePath: string | undefined;

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

  assert.equal(productsResponse.status, 200, "expected product list request to succeed");

  const productsBody = (await productsResponse.json()) as ProductsResponse;
  const [seedProduct] = productsBody.products ?? [];
  assert.ok(seedProduct?.id, "expected at least one seeded product");

  const imageBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const formData = new FormData();
  formData.set("image", new Blob([imageBytes], { type: "image/png" }), "smoke-product.png");

  const uploadResponse = await fetch(`${baseUrl}/api/admin/products/${seedProduct.id}/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${loginBody.token}` },
    body: formData,
  });

  assert.equal(uploadResponse.status, 201, "expected image upload to succeed");

  const uploadBody = (await uploadResponse.json()) as UploadResponse;
  assert.match(uploadBody.imageUrl ?? "", /^\/uploads\/products\/.+\.png$/);

  uploadedImagePath = path.join(env.uploadsDir, uploadBody.imageUrl!.replace("/uploads/", ""));
  await access(uploadedImagePath);

  const servedImageResponse = await fetch(`${baseUrl}${uploadBody.imageUrl}`);
  assert.equal(servedImageResponse.status, 200, "expected uploaded image URL to be served");

  const rejectedFormData = new FormData();
  rejectedFormData.set(
    "image",
    new Blob([new Uint8Array([1, 2, 3])], { type: "text/plain" }),
    "bad.txt",
  );

  const rejectedResponse = await fetch(`${baseUrl}/api/admin/products/${seedProduct.id}/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${loginBody.token}` },
    body: rejectedFormData,
  });

  assert.equal(rejectedResponse.status, 400, "expected non-image upload to be rejected");

  console.log(
    JSON.stringify(
      {
        ok: true,
        product: {
          id: seedProduct.id,
          name: seedProduct.name,
          sku: seedProduct.sku,
        },
        imageUrl: uploadBody.imageUrl,
      },
      null,
      2,
    ),
  );
} finally {
  if (uploadedImagePath) {
    await rm(uploadedImagePath, { force: true });
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
