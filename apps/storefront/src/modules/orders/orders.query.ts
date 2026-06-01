import { queryOptions, useQuery } from "@tanstack/react-query";
import type { OrderDetailResponse, OrderHistoryResponse } from "@otbt/types";

import { storefrontRequest } from "../../lib/http.client";
import { getSessionToken } from "../customers/auth/customer-auth.storage";

export const orderListQueryKey = ["orders"] as const;

async function fetchOrderList(): Promise<OrderHistoryResponse> {
  if (!getSessionToken()) {
    return { orders: [] };
  }

  return storefrontRequest<OrderHistoryResponse>("/orders");
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

export function orderDetailQueryKey(orderId: string) {
  return ["orders", "detail", orderId] as const;
}

async function fetchOrderDetail(orderId: string): Promise<OrderDetailResponse> {
  return storefrontRequest<OrderDetailResponse>(`/orders/${orderId}`);
}

export function orderDetailQueryOptions(orderId: string) {
  return queryOptions({
    queryKey: orderDetailQueryKey(orderId),
    queryFn: () => fetchOrderDetail(orderId),
  });
}

export function useOrderDetailQuery(orderId: string, enabled: boolean) {
  return useQuery({
    ...orderDetailQueryOptions(orderId),
    enabled,
  });
}
