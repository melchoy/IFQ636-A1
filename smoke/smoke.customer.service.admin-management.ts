import assert from "node:assert/strict";

import { env } from "../apps/backend/src/config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "../apps/backend/src/db/connect.js";
import {
  getCustomer,
  listCustomers,
  updateCustomer,
} from "../apps/backend/src/modules/customers/customer.service.js";

await connectDatabase(env.mongodbUri);

try {
  const customers = await listCustomers();
  const targetCustomer = customers[0];

  assert.ok(targetCustomer, "expected at least one customer to manage");

  const before = await getCustomer(targetCustomer.id);
  const nextAccessLevel =
    targetCustomer.accessLevel === "member" ? "standard" : "member";

  assert.ok(before, "expected target customer detail before update");

  const after = await updateCustomer(targetCustomer.id, {
    firstName: `${targetCustomer.firstName}1`,
    accessLevel: nextAccessLevel,
  });

  assert.ok(after, "expected customer update to return a customer");
  assert.equal(after.firstName, `${targetCustomer.firstName}1`);
  assert.equal(after.accessLevel, nextAccessLevel);

  await updateCustomer(targetCustomer.id, {
    firstName: targetCustomer.firstName,
    accessLevel: targetCustomer.accessLevel,
  });

  console.log(
    JSON.stringify(
      {
        ok: true,
        before,
        after,
      },
      null,
      2,
    ),
  );
} finally {
  await disconnectDatabase();
}
