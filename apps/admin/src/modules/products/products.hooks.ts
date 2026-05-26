import { useMutation, useQuery } from "@tanstack/react-query";

import type {
  AdminProductUpdateRequest as ProductUpdateRequest,
  ProductCreate,
} from "@otbt/types";

import { queryClient } from "../../lib/query-client";
import {
  productDetailQuery,
  productDetailQueryKey,
  productListQuery,
} from "./products.query";
import {
  createProduct,
  removeProductImage,
  updateProduct,
  uploadProductImage,
} from "./products.request";

export function useProductList() {
  const { data: productList } = useQuery(productListQuery);

  if (!productList) {
    throw new Error("Product list was not loaded");
  }

  return productList;
}

export function useProductDetail(productId: string) {
  const { data: productDetail } = useQuery(productDetailQuery(productId));

  if (!productDetail) {
    throw new Error("Product detail was not loaded");
  }

  return productDetail;
}

export function useCreateProduct() {
  return useMutation({
    mutationFn: (product: ProductCreate) => createProduct(product),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productListQuery.queryKey });
    },
  });
}

export function useUpdateProduct(productId: string) {
  return useMutation({
    mutationFn: (product: ProductUpdateRequest) => updateProduct(productId, product),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productListQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: productDetailQueryKey(productId) });
    },
  });
}

export function useUploadProductImage(productId: string) {
  return useMutation({
    mutationFn: (file: File) => uploadProductImage(productId, file),
  });
}

export function useRemoveProductImage(productId: string) {
  return useMutation({
    mutationFn: () => removeProductImage(productId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: productListQuery.queryKey });
      await queryClient.invalidateQueries({ queryKey: productDetailQueryKey(productId) });
    },
  });
}
