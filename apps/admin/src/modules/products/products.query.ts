import { queryOptions } from "@tanstack/react-query";

import { fetchProductDetail, fetchProductList } from "./products.request";

const productListQueryKey = ["products", "list"] as const;

export function productDetailQueryKey(productId: string) {
  return ["products", "detail", productId] as const;
}

export const productListQuery = queryOptions({
  queryKey: productListQueryKey,
  queryFn: fetchProductList,
});

export function productDetailQuery(productId: string) {
  return queryOptions({
    queryKey: productDetailQueryKey(productId),
    queryFn: () => fetchProductDetail(productId),
  });
}
