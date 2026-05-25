import { queryOptions, useQuery } from "@tanstack/react-query";

import type { AdminProductListResponse as ProductListResponse } from "@otbt/types";

import { adminHttpRequest } from "../../lib/http.client";

const productListQueryKey = ["products", "list"] as const;

function fetchProductList() {
  return adminHttpRequest<ProductListResponse>("/products");
}

export const productListQuery = queryOptions({
  queryKey: productListQueryKey,
  queryFn: fetchProductList,
});

export function useProductList() {
  const { data: productList } = useQuery(productListQuery);

  if (!productList) {
    throw new Error("Product list was not loaded");
  }

  return productList;
}
