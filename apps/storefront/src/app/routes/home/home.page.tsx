import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

import { ProductCard } from "../../../modules/products/ui/product-card";
import { usePublicProductsQuery } from "../../../modules/products/products.query";

const PRODUCT_PAGE_SIZE = 12;

export function HomePage() {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleProductCount, setVisibleProductCount] =
    useState(PRODUCT_PAGE_SIZE);
  const { data, isError, isLoading } = usePublicProductsQuery();
  const allProducts = data?.products ?? [];
  const products = useMemo(
    () => allProducts.slice(0, visibleProductCount),
    [allProducts, visibleProductCount],
  );
  const hasMoreProducts = products.length < allProducts.length;

  function showMoreProducts() {
    setVisibleProductCount((currentCount) => currentCount + PRODUCT_PAGE_SIZE);
  }

  useEffect(() => {
    const loadMoreElement = loadMoreRef.current;

    if (!loadMoreElement || !hasMoreProducts) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          showMoreProducts();
        }
      },
      { rootMargin: "0px" },
    );

    observer.observe(loadMoreElement);

    return () => observer.disconnect();
  }, [hasMoreProducts, products.length]);

  return (
    <main className="storefront-container px-4 py-4 sm:py-5 md:px-6 lg:py-6">
      <section className="border-b pb-6 pt-4 sm:pb-7 sm:pt-5 md:pb-9 md:pt-7">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground md:mt-6 md:text-lg">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
          <div className="mt-5 md:mt-6">
            <Button asChild>
              <Link to="/#catalogue" unstyled>
                Browse catalogue
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="catalogue" className="py-8 sm:py-10 md:py-12">
        <div className="mb-5 flex flex-col gap-2 sm:mb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Collection</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              Lorem ipsum dolor
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {products.length} of {allProducts.length} products
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : isError ? (
          <div className="rounded-lg border bg-background p-8 text-center text-sm text-destructive">
            Could not load products.
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border bg-background p-8 text-center text-sm text-muted-foreground">
            No public products are available.
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {hasMoreProducts ? (
              <div ref={loadMoreRef} className="mt-8 flex justify-center">
                <Button onClick={showMoreProducts} variant="outline">
                  Load more
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
