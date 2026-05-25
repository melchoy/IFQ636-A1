import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "../../apps/backend/src/config/env.js";
import { connectDatabase, disconnectDatabase } from "../../apps/backend/src/db/connect.js";
import { AdminUser } from "../../apps/backend/src/modules/admin-users/admin-user.model.js";
import { hashAdminPassword } from "../../apps/backend/src/modules/admin-users/admin-user.passwords.js";

const [email, password] = process.argv.slice(2);
const currentDir = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(currentDir, "../data/admin.seed.json");

type AdminSeed = {
  email?: unknown;
  password?: unknown;
};

function requireString(record: AdminSeed, key: keyof AdminSeed) {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid admin seed field "${key}"`);
  }
  return value.trim();
}

async function loadAdminSeed() {
  const file = await readFile(seedPath, "utf8");
  const parsed = JSON.parse(file) as AdminSeed;

  return {
    email: requireString(parsed, "email"),
    password: requireString(parsed, "password"),
  };
}

const adminSeed = email && password ? { email, password } : await loadAdminSeed();

await connectDatabase(env.mongodbUri);

const normalizedEmail = adminSeed.email.toLowerCase();
const passwordHash = await hashAdminPassword(adminSeed.password);

await AdminUser.findOneAndUpdate(
  { email: normalizedEmail },
  {
    email: normalizedEmail,
    passwordHash,
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);

await disconnectDatabase();

console.log(`Seeded admin user: ${normalizedEmail}`);
