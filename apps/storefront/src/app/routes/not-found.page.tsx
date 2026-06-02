import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

import { useCart } from "../../modules/cart";

export function NotFoundPage() {
  const cart = useCart();

  return (
    <main className="storefront-container px-4 py-16 sm:py-20 md:px-6">
      <section className="mx-auto max-w-lg text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          This path has withered away
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          The page you are looking for is not part of the collection. It may have
          been moved, removed, or never existed in the first place.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link to="/" unstyled>
              Browse catalogue
            </Link>
          </Button>
          {cart.itemCount > 0 ? (
            <Button asChild variant="secondary">
              <Link to="/cart" unstyled>
                View cart
              </Link>
            </Button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
