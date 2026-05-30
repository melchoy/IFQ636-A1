export type CartProductSnapshot = {
  productId: string;
  name: string;
  price: number;
  imageUrl: string | null;
};

export type CartItem = CartProductSnapshot & {
  quantity: number;
};

export type CartLineItem = CartItem & {
  lineTotal: number;
};

export type CartSummary = {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
};
