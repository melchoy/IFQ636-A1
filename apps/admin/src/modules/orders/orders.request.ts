import type {
  AdminOrderDetailResponse,
  AdminOrderListResponse,
  AdminOrderStatusUpdateRequest,
  AdminOrderStatusUpdateResponse,
} from "@otbt/types";

import { adminHttpRequest } from "../../lib/http.client";

export function fetchOrderList() {
  return adminHttpRequest<AdminOrderListResponse>("/orders");
}

export function fetchOrderDetail(orderId: string) {
  return adminHttpRequest<AdminOrderDetailResponse>(`/orders/${orderId}`);
}

export function updateOrderStatus(
  orderId: string,
  request: AdminOrderStatusUpdateRequest,
) {
  return adminHttpRequest<AdminOrderStatusUpdateResponse>(
    `/orders/${orderId}/status`,
    {
      body: JSON.stringify(request),
      method: "PATCH",
    },
  );
}
