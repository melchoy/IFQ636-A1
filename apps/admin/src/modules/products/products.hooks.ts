import { useQuery } from "@tanstack/react-query";

import { productListQuery } from "./products.query";

export function useProductList() {
  const { data: productList } = useQuery(productListQuery);

  if (!productList) {
    throw new Error("Product list was not loaded");
  }

  return productList;
}
