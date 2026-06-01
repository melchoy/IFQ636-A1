import { queryOptions } from "@tanstack/react-query";

import { fetchOrderDetail, fetchOrderList } from "./orders.request";

const orderListQueryKey = ["orders", "list"] as const;

export function orderDetailQueryKey(orderId: string) {
  return ["orders", "detail", orderId] as const;
}

export const orderListQuery = queryOptions({
  queryKey: orderListQueryKey,
  queryFn: fetchOrderList,
});

export function orderDetailQuery(orderId: string) {
  return queryOptions({
    queryKey: orderDetailQueryKey(orderId),
    queryFn: () => fetchOrderDetail(orderId),
  });
}
