import { ImageIcon, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { Button, Input } from "@otbt/ui";
import { Link } from "@otbt/web";

import {
  clearCartItems,
  removeCartItem,
  updateCartItemQuantity,
  useCart,
} from "..";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);
}

export function CartReview() {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <main className="storefront-container px-4 py-4 sm:py-5 md:px-6 lg:py-6">
        <p className="text-xs leading-[18px] text-muted-foreground">Cart</p>

        <section className="mt-4 flex min-h-[480px] flex-col items-center justify-center rounded-lg border bg-card px-6 py-16 text-center">
          <div className="flex size-[124px] items-center justify-center rounded-[10px] border border-border/80 bg-[color-mix(in_oklab,var(--bt-obsidian)_82%,transparent)]">
            <ShoppingCart
              aria-hidden="true"
              className="size-[54px] text-primary"
              strokeWidth={1.25}
            />
          </div>

          <p className="mt-8 text-[13px] font-semibold uppercase tracking-wide text-primary">
            Cart empty
          </p>
          <h1 className="mt-4 text-[34px] font-bold leading-[42px] text-foreground">
            Your cart is empty.
          </h1>
          <p className="mt-4 max-w-[500px] text-[17px] leading-[26px] text-muted-foreground">
            Browse the collection and add selected arrangements before checkout.
          </p>
          <Button asChild className="mt-10 h-10 min-w-[168px] px-4">
            <Link to="/" unstyled>
              Shop collection
            </Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="storefront-container px-4 py-10 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section>
          <h1 className="text-4xl font-semibold text-foreground">Your cart</h1>
          <div className="mt-8 divide-y rounded-lg border bg-card">
            {cart.items.map((item) => (
              <article
                className="grid gap-4 p-4 sm:grid-cols-[96px_minmax(0,1fr)_auto]"
                key={item.productId}
              >
                <div className="flex aspect-square items-center justify-center rounded-md bg-muted">
                  {item.imageUrl ? (
                    <img
                      alt={item.name}
                      className="max-h-full max-w-full object-contain object-center"
                      src={item.imageUrl}
                    />
                  ) : (
                    <ImageIcon
                      aria-hidden="true"
                      className="size-8 text-muted-foreground"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold text-foreground">
                    {item.name}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatPrice(item.price)}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Button
                      onClick={() =>
                        updateCartItemQuantity(item.productId, item.quantity - 1)
                      }
                      size="icon"
                      type="button"
                      variant="outline"
                    >
                      <Minus className="size-4" />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <Input
                      aria-label={`Quantity for ${item.name}`}
                      className="h-9 w-16 text-center"
                      min="1"
                      onChange={(event) => {
                        const nextQuantity = Number(event.currentTarget.value);

                        if (
                          !Number.isFinite(nextQuantity) ||
                          nextQuantity < 1
                        ) {
                          return;
                        }

                        updateCartItemQuantity(item.productId, nextQuantity);
                      }}
                      type="number"
                      value={item.quantity}
                    />
                    <Button
                      onClick={() =>
                        updateCartItemQuantity(item.productId, item.quantity + 1)
                      }
                      size="icon"
                      type="button"
                      variant="outline"
                    >
                      <Plus className="size-4" />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                    <Button
                      onClick={() => removeCartItem(item.productId)}
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 className="size-4" />
                      Remove
                    </Button>
                  </div>
                </div>

                <p className="text-sm font-semibold text-foreground">
                  {formatPrice(item.lineTotal)}
                </p>
              </article>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold text-foreground">Summary</h2>
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-base font-semibold text-foreground">
              {formatPrice(cart.subtotal)}
            </span>
          </div>
          <Button asChild className="mt-5 w-full">
            <Link to="/checkout" unstyled>
              Checkout
            </Link>
          </Button>
          <Button
            className="mt-2 w-full"
            onClick={clearCartItems}
            type="button"
            variant="ghost"
          >
            Clear cart
          </Button>
        </aside>
      </div>
    </main>
  );
}
