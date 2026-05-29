import assert from "node:assert/strict";

import type { Customer } from "@otbt/types";

import { app } from "../apps/backend/src/app.js";
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

type LoginResponse = {
  token?: string;
};

type CustomerResponse = {
  customer?: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    status?: string;
    accessLevel?: string;
  };
};

type CustomersResponse = {
  customers?: NonNullable<CustomerResponse["customer"]>[];
};

await connectDatabase(env.mongodbUri);

const server = app.listen(0);
let originalCustomer: Customer | null = null;
let editedCustomerId: string | null = null;

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

  const authHeaders = {
    Authorization: `Bearer ${loginBody.token}`,
    "Content-Type": "application/json",
  };

  const customersResponse = await fetch(`${baseUrl}/api/admin/customers`, {
    headers: authHeaders,
  });

  assert.equal(customersResponse.status, 200, "expected customer list request to succeed");

  const customersBody = (await customersResponse.json()) as CustomersResponse;
  const [seedCustomer] = customersBody.customers ?? [];
  assert.ok(seedCustomer?.id, "expected a seeded customer id");

  originalCustomer = await getCustomer(seedCustomer.id);
  assert.ok(originalCustomer, "expected original customer");
  editedCustomerId = originalCustomer.id;

  const detailResponse = await fetch(`${baseUrl}/api/admin/customers/${seedCustomer.id}`, {
    headers: authHeaders,
  });

  assert.equal(detailResponse.status, 200, "expected customer detail request to succeed");

  const detailBody = (await detailResponse.json()) as CustomerResponse;
  assert.equal(detailBody.customer?.id, seedCustomer.id, "expected matching customer detail");

  const updatedFirstName = `${originalCustomer.firstName} 1`;
  const updatedAccessLevel =
    originalCustomer.accessLevel === "member" ? "standard" : "member";

  const updateResponse = await fetch(`${baseUrl}/api/admin/customers/${seedCustomer.id}`, {
    method: "PATCH",
    headers: authHeaders,
    body: JSON.stringify({
      firstName: updatedFirstName,
      accessLevel: updatedAccessLevel,
    }),
  });

  assert.equal(updateResponse.status, 200, "expected customer update request to succeed");

  const updateBody = (await updateResponse.json()) as CustomerResponse;
  assert.equal(updateBody.customer?.firstName, updatedFirstName, "expected updated first name");
  assert.equal(
    updateBody.customer?.accessLevel,
    updatedAccessLevel,
    "expected updated access level",
  );

  const invalidUpdateResponse = await fetch(
    `${baseUrl}/api/admin/customers/${seedCustomer.id}`,
    {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ status: "invalid-status" }),
    },
  );

  assert.equal(invalidUpdateResponse.status, 400, "expected invalid update to fail");

  const unauthenticatedResponse = await fetch(
    `${baseUrl}/api/admin/customers/${seedCustomer.id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName: originalCustomer.firstName }),
    },
  );

  assert.equal(unauthenticatedResponse.status, 401, "expected unauthenticated update to fail");

  const missingResponse = await fetch(
    `${baseUrl}/api/admin/customers/000000000000000000000000`,
    {
      headers: authHeaders,
    },
  );

  assert.equal(missingResponse.status, 404, "expected missing customer detail to return 404");

  console.log(
    JSON.stringify(
      {
        ok: true,
        list: {
          status: customersResponse.status,
          count: customersBody.customers?.length,
        },
        detail: {
          status: detailResponse.status,
          customer: detailBody.customer,
        },
        beforeEdit: {
          id: originalCustomer.id,
          firstName: originalCustomer.firstName,
          accessLevel: originalCustomer.accessLevel,
        },
        afterEdit: {
          id: updateBody.customer?.id,
          firstName: updateBody.customer?.firstName,
          accessLevel: updateBody.customer?.accessLevel,
        },
        invalidUpdate: {
          status: invalidUpdateResponse.status,
          body: await invalidUpdateResponse.json(),
        },
        unauthenticated: {
          status: unauthenticatedResponse.status,
          body: await unauthenticatedResponse.json(),
        },
        missing: {
          status: missingResponse.status,
          body: await missingResponse.json(),
        },
        customerCount: (await listCustomers()).length,
      },
      null,
      2,
    ),
  );
} finally {
  if (editedCustomerId && originalCustomer) {
    await updateCustomer(editedCustomerId, {
      firstName: originalCustomer.firstName,
      lastName: originalCustomer.lastName,
      email: originalCustomer.email,
      status: originalCustomer.status,
      accessLevel: originalCustomer.accessLevel,
    });
  }

  server.close();
  await disconnectDatabase();
}
