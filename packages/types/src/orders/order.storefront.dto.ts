import type {
  Order,
  OrderCustomerSnapshot,
  OrderDeliveryAddress,
} from "./order.entity.js";

export interface CheckoutLineItemRequest {
  productId: string;
  quantity: number;
}

export interface CheckoutRequest {
  customer: Omit<OrderCustomerSnapshot, "customerId"> & {
    customerId?: string | null;
  };
  deliveryAddress: OrderDeliveryAddress;
  items: CheckoutLineItemRequest[];
}

export interface CheckoutResponse {
  order: Order;
}
