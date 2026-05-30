import { useState } from "react";

import { Button, type ButtonProps } from "@otbt/ui";

import { addCartItem, type CartProductSnapshot } from "../../cart";

type AddToCartButtonProps = Omit<ButtonProps, "onClick" | "type"> & {
  product: CartProductSnapshot;
  quantity?: number;
};

export function AddToCartButton({
  children = "Add to cart",
  product,
  quantity = 1,
  ...buttonProps
}: AddToCartButtonProps) {
  const [hasAdded, setHasAdded] = useState(false);

  function handleAddToCart() {
    addCartItem(product, quantity);
    setHasAdded(true);
    window.setTimeout(() => setHasAdded(false), 1200);
  }

  return (
    <Button type="button" onClick={handleAddToCart} {...buttonProps}>
      {hasAdded ? "Added" : children}
    </Button>
  );
}
