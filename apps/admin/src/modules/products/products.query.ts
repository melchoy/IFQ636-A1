import { queryOptions } from "@tanstack/react-query";

import { fetchProductList } from "./products.request";

const productListQueryKey = ["products", "list"] as const;

export const productListQuery = queryOptions({
  queryKey: productListQueryKey,
  queryFn: fetchProductList,
});
