import { useQuery } from "@tanstack/react-query";

import { orderDetailQuery, orderListQuery } from "./orders.query";

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
