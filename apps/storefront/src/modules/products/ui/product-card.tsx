import { Link } from "react-router";
import { ImageIcon } from "lucide-react";

import type { ProductListItem } from "@otbt/types";

import { AddToCartButton } from "./add-to-cart-button";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);
}

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <article className="group">
      <Link
        to={`/products/${product.id}`}
        className="flex aspect-square items-center justify-center rounded-lg border border-product-image-well-border bg-product-image-well"
        aria-label={`View ${product.name}`}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full rounded-lg object-contain object-center"
          />
        ) : (
          <ImageIcon className="size-10 text-muted-foreground" aria-hidden="true" />
        )}
      </Link>

      <h2 className="mt-3 text-base font-medium text-foreground">
        <Link
          to={`/products/${product.id}`}
          className="transition hover:text-muted-foreground"
        >
          {product.name}
        </Link>
      </h2>

      <div className="mt-1.5 flex items-center justify-between">
        <p className="text-base font-medium text-primary">
          {formatPrice(product.price)}
        </p>
        <AddToCartButton
          size="sm"
          variant="default"
          product={{
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl ?? null,
          }}
        >
          Add to Cart
        </AddToCartButton>
      </div>
    </article>
  );
}
