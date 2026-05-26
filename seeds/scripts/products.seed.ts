import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "../../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../../apps/backend/src/db/connect.js";
import { ProductModel } from "../../apps/backend/src/modules/products/product.model.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(currentDir, "../data/products.seed.json");

type ProductSeedRecord = {
  name?: unknown;
  sku?: unknown;
  description?: unknown;
  imageUrl?: unknown;
  price?: unknown;
  stock?: unknown;
};

function requireString(record: ProductSeedRecord, key: keyof ProductSeedRecord) {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid product seed field "${key}"`);
  }
  return value.trim();
}

function optionalString(record: ProductSeedRecord, key: keyof ProductSeedRecord) {
  const value = record[key];
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid product seed field "${key}"`);
  }
  return value.trim();
}

function requireNumber(record: ProductSeedRecord, key: keyof ProductSeedRecord) {
  const value = record[key];
  if (typeof value !== "number" || Number.isNaN(value) || value < 0) {
    throw new Error(`Invalid product seed field "${key}"`);
  }
  return value;
}

async function loadProductSeeds() {
  const file = await readFile(seedPath, "utf8");
  const parsed = JSON.parse(file) as ProductSeedRecord[];

  if (!Array.isArray(parsed)) {
    throw new Error("Product seed data must be an array");
  }

  return parsed.map((record) => ({
    name: requireString(record, "name"),
    sku: requireString(record, "sku").toUpperCase(),
    description: requireString(record, "description"),
    imageUrl: optionalString(record, "imageUrl"),
    price: requireNumber(record, "price"),
    stock: requireNumber(record, "stock"),
    status: "active" as const,
    visibility: "public" as const,
  }));
}

const productSeeds = await loadProductSeeds();

await connectDatabase(env.mongodbUri);

for (const productSeed of productSeeds) {
  await ProductModel.findOneAndUpdate(
    { sku: productSeed.sku },
    productSeed,
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

await disconnectDatabase();

console.log(`Seeded ${productSeeds.length} products`);
