import type {
  Order,
  OrderCustomerSnapshot,
  OrderDeliveryAddress,
  OrderStatus,
} from "./order.entity.js";

export interface CheckoutLineItemRequest {
  productId: string;
  quantity: number;
}

export interface CheckoutRequest {
  customer: Omit<OrderCustomerSnapshot, "customerId">;
  deliveryAddress: OrderDeliveryAddress;
  items: CheckoutLineItemRequest[];
}

export interface CheckoutResponse {
  order: Order;
}

export interface CheckoutSessionResponse {
  orderId: string;
  redirectUrl: string;
}

export interface OrderHistoryItem {
  id: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  itemSummary: string;
}

export interface OrderHistoryResponse {
  orders: OrderHistoryItem[];
}

export interface OrderDetailResponse {
  order: Order;
}
