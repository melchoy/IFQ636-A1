import { randomUUID } from "node:crypto";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { env } from "../../config/env.js";

const productImagesDirectoryName = "products";
const productImagesUrlPath = "/uploads/products";

const allowedExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);

export type StoreProductImageInput = {
  buffer: Uint8Array;
  originalName: string;
};

export type StoredProductImage = {
  filename: string;
  imageUrl: string;
  path: string;
};

function getSafeImageExtension(originalName: string) {
  const extension = path.extname(originalName).toLowerCase();

  return allowedExtensions.has(extension) ? extension : ".bin";
}

export async function storeProductImage(input: StoreProductImageInput): Promise<StoredProductImage> {
  const productImagesDir = path.join(env.uploadsDir, productImagesDirectoryName);
  await mkdir(productImagesDir, { recursive: true });

  const filename = `${randomUUID()}${getSafeImageExtension(input.originalName)}`;
  const imagePath = path.join(productImagesDir, filename);

  await writeFile(imagePath, input.buffer);

  return {
    filename,
    imageUrl: `${productImagesUrlPath}/${filename}`,
    path: imagePath,
  };
}

function getProductImagePathFromUrl(imageUrl: string) {
  if (!imageUrl.startsWith(`${productImagesUrlPath}/`)) {
    return null;
  }

  const filename = path.basename(imageUrl);

  if (!filename) {
    return null;
  }

  return path.join(env.uploadsDir, productImagesDirectoryName, filename);
}

export async function deleteProductImage(imageUrl: string) {
  const imagePath = getProductImagePathFromUrl(imageUrl);

  if (!imagePath) {
    return;
  }

  await rm(imagePath, { force: true });
}
