import { ImageIcon, Minus, Plus, Trash2 } from "lucide-react";

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
      <main className="storefront-container px-4 py-10 md:px-6">
        <section className="rounded-lg border bg-background p-8 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Your cart</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your cart is empty.
          </p>
          <Button asChild className="mt-6">
            <Link to="/" unstyled>
              Browse catalogue
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
          <div className="mt-8 divide-y rounded-lg border bg-background">
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

        <aside className="h-fit rounded-lg border bg-background p-5">
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
