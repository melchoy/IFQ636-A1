import type { Order, OrderStatus } from "./order.entity.js";

export interface AdminOrderListItem {
  id: string;
  reference: string;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  itemSummary: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminOrderDetail = Order;

export interface AdminOrderListResponse {
  orders: AdminOrderListItem[];
}

export interface AdminOrderDetailResponse {
  order: AdminOrderDetail;
}

export interface AdminOrderStatusUpdateRequest {
  status: OrderStatus;
}

export interface AdminOrderStatusUpdateResponse {
  order: Order;
}
