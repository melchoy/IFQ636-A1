import { queryOptions, useQuery } from "@tanstack/react-query";
import type { OrderHistoryResponse } from "@otbt/types";

import { storefrontRequest } from "../../lib/http.client";
import { getSessionToken } from "../customers/auth/customer-auth.storage";

export const orderListQueryKey = ["orders"] as const;

async function fetchOrderList(): Promise<OrderHistoryResponse> {
  const sessionToken = getSessionToken();

  if (!sessionToken) {
    return { orders: [] };
  }

  return storefrontRequest<OrderHistoryResponse>("/orders", {
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
  });
}

export function orderListQueryOptions() {
  return queryOptions({
    queryKey: orderListQueryKey,
    queryFn: fetchOrderList,
  });
}

export function useOrderListQuery(enabled: boolean) {
  return useQuery({
    ...orderListQueryOptions(),
    enabled,
  });
}
