import { queryOptions, useQuery } from "@tanstack/react-query";

import type { ProductDetailResponse, ProductListResponse } from "@otbt/types";

import { storefrontRequest } from "../../lib/http.client";

const publicProductsQueryKey = ["public-products"] as const;
const publicProductQueryKey = (productId: string) =>
  ["public-product", productId] as const;

async function fetchPublicProducts() {
  return storefrontRequest<ProductListResponse>("/products");
}

async function fetchPublicProduct(productId: string) {
  return storefrontRequest<ProductDetailResponse>(`/products/${productId}`);
}

export function publicProductsQueryOptions() {
  return queryOptions({
    queryKey: publicProductsQueryKey,
    queryFn: fetchPublicProducts,
  });
}

export function publicProductQueryOptions(productId: string) {
  return queryOptions({
    queryKey: publicProductQueryKey(productId),
    queryFn: () => fetchPublicProduct(productId),
  });
}

export function usePublicProductsQuery() {
  return useQuery(publicProductsQueryOptions());
}

export function usePublicProductQuery(productId: string) {
  return useQuery(publicProductQueryOptions(productId));
}
