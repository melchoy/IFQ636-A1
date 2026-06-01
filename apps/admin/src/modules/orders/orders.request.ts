import type {
  AdminOrderDetailResponse,
  AdminOrderListResponse,
} from "@otbt/types";

import { adminHttpRequest } from "../../lib/http.client";

export function fetchOrderList() {
  return adminHttpRequest<AdminOrderListResponse>("/orders");
}

export function fetchOrderDetail(orderId: string) {
  return adminHttpRequest<AdminOrderDetailResponse>(`/orders/${orderId}`);
}
