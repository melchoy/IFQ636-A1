import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { env } from "../../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../../apps/backend/src/db/connect.js";
import { CustomerModel } from "../../apps/backend/src/modules/customers/customer.model.js";
import { hashCustomerPassword } from "../../apps/backend/src/modules/customers/customer.passwords.js";
import type { CustomerAccessLevel, CustomerStatus } from "../../packages/types/src/index.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(currentDir, "../data/customers.seed.json");

type CustomerSeedRecord = {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  password?: unknown;
  status?: unknown;
  accessLevel?: unknown;
};

function requireString(record: CustomerSeedRecord, key: keyof CustomerSeedRecord) {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid customer seed field "${key}"`);
  }
  return value.trim();
}

function optionalCustomerStatus(record: CustomerSeedRecord): CustomerStatus {
  if (record.status === undefined) {
    return "active";
  }

  if (record.status === "active" || record.status === "disabled") {
    return record.status;
  }

  throw new Error('Invalid customer seed field "status"');
}

function optionalCustomerAccessLevel(record: CustomerSeedRecord): CustomerAccessLevel {
  if (record.accessLevel === undefined) {
    return "standard";
  }

  if (record.accessLevel === "standard" || record.accessLevel === "member") {
    return record.accessLevel;
  }

  throw new Error('Invalid customer seed field "accessLevel"');
}

async function loadCustomerSeeds() {
  const file = await readFile(seedPath, "utf8");
  const parsed = JSON.parse(file) as CustomerSeedRecord[];

  if (!Array.isArray(parsed)) {
    throw new Error("Customer seed data must be an array");
  }

  return parsed.map((record) => ({
    firstName: requireString(record, "firstName"),
    lastName: requireString(record, "lastName"),
    email: requireString(record, "email").toLowerCase(),
    password: requireString(record, "password"),
    status: optionalCustomerStatus(record),
    accessLevel: optionalCustomerAccessLevel(record),
  }));
}

const customerSeeds = await loadCustomerSeeds();

await connectDatabase(env.mongodbUri);

for (const customerSeed of customerSeeds) {
  await CustomerModel.findOneAndUpdate(
    { email: customerSeed.email },
    {
      firstName: customerSeed.firstName,
      lastName: customerSeed.lastName,
      email: customerSeed.email,
      passwordHash: await hashCustomerPassword(customerSeed.password),
      status: customerSeed.status,
      accessLevel: customerSeed.accessLevel,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

await disconnectDatabase();

console.log(`Seeded ${customerSeeds.length} customers`);
