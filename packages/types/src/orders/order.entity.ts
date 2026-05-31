export const ORDER_STATUSES = ["pending", "confirmed", "cancelled"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface OrderCustomerSnapshot {
  customerId: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
}

export interface OrderDeliveryAddress {
  recipientName: string;
  addressLine1: string;
  addressLine2: string | null;
  suburb: string;
  state: string;
  postcode: string;
  instructions: string | null;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  imageUrl: string | null;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  customer: OrderCustomerSnapshot;
  deliveryAddress: OrderDeliveryAddress;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export type OrderCreate = Pick<
  Order,
  "customer" | "deliveryAddress" | "items" | "subtotal" | "total"
> & {
  status?: OrderStatus;
};
