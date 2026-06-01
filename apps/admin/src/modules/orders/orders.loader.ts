import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

import { queryClient } from "../../lib/query-client";
import { getAdminToken } from "../auth/auth.storage";
import { orderDetailQuery, orderListQuery } from "./orders.query";

function requireOrderId(params: LoaderFunctionArgs["params"]) {
  const orderId = params.orderId;

  if (!orderId) {
    throw new Error("Order not found");
  }

  return orderId;
}

export async function orderListLoader() {
  if (!getAdminToken()) {
    throw redirect("/login");
  }

  return queryClient.ensureQueryData(orderListQuery);
}

export async function orderDetailLoader({ params }: LoaderFunctionArgs) {
  if (!getAdminToken()) {
    throw redirect("/login");
  }

  const orderId = requireOrderId(params);

  await queryClient.ensureQueryData(orderDetailQuery(orderId));

  return { orderId };
}
