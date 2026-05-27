import { queryOptions, useQuery } from "@tanstack/react-query";

import type { ProductListResponse } from "@otbt/types";

import { storefrontRequest } from "../../lib/http.client";

const publicProductsQueryKey = ["public-products"] as const;

async function fetchPublicProducts() {
  return storefrontRequest<ProductListResponse>("/products");
}

export function publicProductsQueryOptions() {
  return queryOptions({
    queryKey: publicProductsQueryKey,
    queryFn: fetchPublicProducts,
  });
}

export function usePublicProductsQuery() {
  return useQuery(publicProductsQueryOptions());
}
