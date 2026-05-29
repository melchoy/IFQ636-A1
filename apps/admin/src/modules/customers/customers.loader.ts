import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { queryClient } from "../../lib/query-client";
import { getAdminToken } from "../auth/auth.storage";
import { customerDetailQuery, customerListQuery } from "./customers.query";

function requireCustomerId(params: LoaderFunctionArgs["params"]) {
  const customerId = params.customerId;

  if (!customerId) {
    throw new Error("Customer not found");
  }

  return customerId;
}

export async function customerListLoader() {
  if (!getAdminToken()) {
    throw redirect("/login");
  }

  return queryClient.ensureQueryData(customerListQuery);
}

export async function customerEditLoader({ params }: LoaderFunctionArgs) {
  if (!getAdminToken()) {
    throw redirect("/login");
  }

  const customerId = requireCustomerId(params);

  await queryClient.ensureQueryData(customerDetailQuery(customerId));

  return { customerId };
}
