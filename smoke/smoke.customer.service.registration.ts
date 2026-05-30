import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { CustomerModel } from "../apps/backend/src/modules/customers/customer.model.js";
import { registerCustomer } from "../apps/backend/src/modules/customers/customer.service.js";

await connectDatabase(env.mongodbUri);

const email = `smoke-customer-${Date.now()}@example.com`;
let createdCustomerId: string | undefined;

try {
  const customer = await registerCustomer({
    firstName: "Smoke",
    lastName: "Customer",
    email,
    password: "password",
  });
  const persistedCustomer = await CustomerModel.findById(customer.id).lean().exec();

  createdCustomerId = customer.id;

  assert.equal(customer.firstName, "Smoke");
  assert.equal(customer.lastName, "Customer");
  assert.equal(customer.email, email);
  assert.ok(persistedCustomer, "expected customer to be persisted");
  assert.equal(persistedCustomer.firstName, "Smoke");
  assert.equal(persistedCustomer.lastName, "Customer");
  assert.equal(persistedCustomer.email, email);
  assert.equal(typeof persistedCustomer.passwordHash, "string");

  console.log(
    JSON.stringify(
      {
        ok: true,
        customer,
        passwordHashStored: Boolean(persistedCustomer.passwordHash),
      },
      null,
      2,
    ),
  );
} finally {
  if (createdCustomerId) {
    await CustomerModel.findByIdAndDelete(createdCustomerId).exec();
  } else {
    await CustomerModel.deleteOne({ email }).exec();
  }

  await disconnectDatabase();
}
