import { useMutation, useQuery } from "@tanstack/react-query";

import type { AdminOrderStatusUpdateRequest } from "@otbt/types";

import { queryClient } from "../../lib/query-client";
import {
  orderDetailQuery,
  orderDetailQueryKey,
  orderListQuery,
} from "./orders.query";
import { updateOrderStatus } from "./orders.request";

export function useOrderList() {
  const { data: orderList } = useQuery(orderListQuery);

  if (!orderList) {
    throw new Error("Order list was not loaded");
  }

  return orderList;
}

export function useOrderDetail(orderId: string) {
  const { data: orderDetail } = useQuery(orderDetailQuery(orderId));

  if (!orderDetail) {
    throw new Error("Order detail was not loaded");
  }

  return orderDetail;
}

export function useUpdateOrderStatus(orderId: string) {
  return useMutation({
    mutationFn: (request: AdminOrderStatusUpdateRequest) =>
      updateOrderStatus(orderId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: orderListQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: orderDetailQueryKey(orderId) });
    },
  });
}
