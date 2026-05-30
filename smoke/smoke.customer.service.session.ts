import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import { CustomerModel } from "../apps/backend/src/modules/customers/customer.model.js";
import {
  findCustomerByCredentials,
  findCustomerById,
  registerCustomer,
} from "../apps/backend/src/modules/customers/customer.service.js";
import {
  generateCustomerToken,
  verifyCustomerToken,
} from "../apps/backend/src/modules/customers/customer.tokens.js";

await connectDatabase(env.mongodbUri);

const email = `smoke-customer-session-${Date.now()}@example.com`;
let createdCustomerId: string | undefined;

try {
  const registeredCustomer = await registerCustomer({
    firstName: "Smoke",
    lastName: "Session",
    email,
    password: "password",
  });
  const authenticatedCustomer = await findCustomerByCredentials(email, "password");
  const invalidCustomer = await findCustomerByCredentials(email, "wrong-password");
  const fetchedCustomer = await findCustomerById(registeredCustomer.id);
  const token = generateCustomerToken({
    id: registeredCustomer.id,
    email: registeredCustomer.email,
  });
  const payload = verifyCustomerToken(token);

  createdCustomerId = registeredCustomer.id;

  assert.equal(authenticatedCustomer?.id, registeredCustomer.id);
  assert.equal(invalidCustomer, null);
  assert.equal(fetchedCustomer?.id, registeredCustomer.id);
  assert.equal(payload.id, registeredCustomer.id);
  assert.equal(payload.email, registeredCustomer.email);

  console.log(
    JSON.stringify(
      {
        ok: true,
        authenticatedCustomer,
        invalidCustomer,
        fetchedCustomer,
        tokenPayload: {
          id: payload.id,
          email: payload.email,
        },
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
