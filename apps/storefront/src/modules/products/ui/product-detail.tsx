import { useState } from "react";

import { ImageIcon } from "lucide-react";
import { Link } from "react-router";

import type { ProductDetail as ProductDetailDto } from "@otbt/types";

import { StorefrontBreadcrumbs } from "../../common/storefront-breadcrumbs";
import { AddToCartButton } from "./add-to-cart-button";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(price);
}

export function ProductDetail({ product }: { product: ProductDetailDto }) {
  const [quantity, setQuantity] = useState(1);
  const stockLabel =
    product.stock > 0 ? `${product.stock} in stock` : "Out of stock";
  const availabilityLabel = product.stock > 0 ? "Available" : "Unavailable";

  return (
    <main className="storefront-container px-4 py-8 md:px-6 lg:py-10">
      <article className="grid gap-10 lg:grid-cols-[minmax(0,680px)_minmax(420px,620px)] lg:gap-[68px]">
        <section className="max-w-[680px]">
          <StorefrontBreadcrumbs
            items={[
              { label: "Collection", to: "/" },
              { label: product.name },
            ]}
          />

          <h1 className="mt-5 text-[42px] font-semibold leading-[1.08] tracking-normal text-foreground sm:text-[52px]">
            {product.name}
          </h1>

          <div className="mt-5 flex items-baseline gap-8">
            <p className="text-2xl font-semibold leading-8 text-foreground">
              {formatPrice(product.price)}
            </p>
            <p className="text-[13px] font-semibold leading-[18px] text-emerald-800">
              {stockLabel}
            </p>
          </div>

          <p className="mt-10 max-w-[620px] text-base leading-[25px] text-muted-foreground">
            {product.description}
          </p>

          <div className="mt-10 border-t pt-8">
            <p className="text-[13px] font-semibold leading-[18px] text-foreground">
              Product details
            </p>
            <dl className="mt-5 space-y-3 text-sm font-medium leading-5 text-muted-foreground">
              <div>
                <dt className="sr-only">SKU</dt>
                <dd>SKU {product.sku}</dd>
              </div>
              <div>
                <dt className="sr-only">Availability</dt>
                <dd>{availabilityLabel}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-5 border-b pb-7">
            <label
              htmlFor="product-quantity"
              className="text-[13px] font-semibold leading-[18px] text-foreground"
            >
              Quantity
            </label>
            <div className="mt-3 flex flex-wrap gap-6">
              <input
                id="product-quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(event) => {
                  setQuantity(Number(event.currentTarget.value));
                }}
                className="h-11 w-20 rounded-lg border bg-background px-3 text-center text-[15px] font-semibold text-foreground"
              />
              <AddToCartButton
                className="min-w-40 px-8"
                product={{
                  productId: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrl ?? null,
                }}
                quantity={quantity}
              />
            </div>
          </div>
        </section>

        <section className="flex aspect-square min-h-[320px] items-center justify-center rounded-xl border border-product-image-well-border bg-product-image-well p-6 lg:mt-[104px] lg:size-[620px]">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain object-center"
            />
          ) : (
            <ImageIcon className="size-14 text-muted-foreground" aria-hidden="true" />
          )}
        </section>
      </article>
    </main>
  );
}
