import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router";

import { Button } from "@otbt/ui";
import { Link } from "@otbt/web";

import { currentCustomerQueryOptions } from "../../../modules/customers/auth/customer-auth.query";
import { getSessionToken } from "../../../modules/customers/auth/customer-auth.storage";
import { ProductCard } from "../../../modules/products/ui/product-card";
import { usePublicProductsQuery } from "../../../modules/products/products.query";

const PRODUCT_PAGE_SIZE = 12;
const COLLECTION_SECTION_ID = "catalogue";

function scrollToCollection() {
  document.getElementById(COLLECTION_SECTION_ID)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function HomePage() {
  const location = useLocation();
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleProductCount, setVisibleProductCount] =
    useState(PRODUCT_PAGE_SIZE);
  const hasSessionToken = Boolean(getSessionToken());
  const currentCustomerQuery = useQuery(currentCustomerQueryOptions());
  const { data, isError, isLoading } = usePublicProductsQuery();
  const heroAccountAction =
    hasSessionToken && !currentCustomerQuery.isError
      ? { label: "Orders", to: "/orders" }
      : { label: "Sign in", to: "/login" };
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
    if (location.hash === `#${COLLECTION_SECTION_ID}`) {
      scrollToCollection();
    }
  }, [location.hash]);

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
      <section className="relative overflow-hidden rounded-[10px] border border-product-image-well-border">
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat opacity-60"
          style={{ backgroundImage: "url('/hero-background.png')" }}
          aria-hidden="true"
        />

        <div className="relative flex min-h-[320px] items-stretch md:min-h-[408px]">
          <div className="z-10 flex flex-1 flex-col justify-center px-6 py-8 md:max-w-[55%] md:px-8 md:py-10">
            <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl md:text-[40px] md:leading-[46px]">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-[26px] text-foreground md:mt-5">
              Lorem Ipsum has been the industry's standard dummy text ever since
              1966, when designers at Letraset and James Mosley, the librarian
              at St Bride Printing Library, took a 1914 Cicero translation and
              scrambled it to make dummy text for Letraset's Body Type sheets.
            </p>
            <div className="mt-6 flex gap-5 md:mt-8">
              <Button type="button" onClick={scrollToCollection}>
                Shop flowers
              </Button>
              <Button asChild variant="secondary">
                <Link to={heroAccountAction.to} unstyled>
                  {heroAccountAction.label}
                </Link>
              </Button>
            </div>
          </div>

          <div className="pointer-events-none relative hidden flex-1 items-center justify-center md:flex md:justify-end md:pr-[5%]">
            <img
              src="/flowers.png"
              alt=""
              className="relative z-10 h-full max-h-[440px] w-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section
        id={COLLECTION_SECTION_ID}
        className="scroll-mt-4 py-8 sm:py-10 md:py-12"
      >
        <div className="mb-5 flex flex-col gap-2 sm:mb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Collection</p>
            <h2 className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">
              Luxury arrangements with a moody elegance
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {products.length} of {allProducts.length} products
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
            Loading products...
          </div>
        ) : isError ? (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-destructive">
            Could not load products.
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
            No public products are available.
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
