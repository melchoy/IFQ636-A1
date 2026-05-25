import type {
  AdminProductDetailResponse as ProductDetailResponse,
  AdminProductListResponse as ProductListResponse,
  AdminProductUpdateRequest as ProductUpdateRequest,
  AdminProductUpdateResponse as ProductUpdateResponse,
} from "@otbt/types";

import { adminHttpRequest } from "../../lib/http.client";

export function fetchProductList() {
  return adminHttpRequest<ProductListResponse>("/products");
}

export function fetchProductDetail(productId: string) {
  return adminHttpRequest<ProductDetailResponse>(`/products/${productId}`);
}

export function updateProduct(productId: string, product: ProductUpdateRequest) {
  return adminHttpRequest<ProductUpdateResponse>(`/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(product),
  });
}
