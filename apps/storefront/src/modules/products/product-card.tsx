import { ImageIcon } from "lucide-react";

import type { ProductListItem } from "@otbt/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);
}

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <article className="group overflow-hidden rounded-lg border bg-background">
      <div className="flex aspect-[4/3] items-center justify-center bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-contain object-center"
          />
        ) : (
          <ImageIcon className="size-10 text-muted-foreground" aria-hidden="true" />
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <h2 className="text-base font-semibold leading-6 text-foreground">
            {product.name}
          </h2>
          <p className="text-sm font-medium text-foreground sm:shrink-0">
            {formatPrice(product.price)}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {product.description}
        </p>
      </div>
    </article>
  );
}
