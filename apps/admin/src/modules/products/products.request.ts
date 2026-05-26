import type {
  AdminProductCreateResponse as ProductCreateResponse,
  AdminProductDetailResponse as ProductDetailResponse,
  AdminProductListResponse as ProductListResponse,
  AdminProductUpdateRequest as ProductUpdateRequest,
  AdminProductUpdateResponse as ProductUpdateResponse,
  ProductCreate,
} from "@otbt/types";

import {
  adminHttpRequest,
  multipartRequest,
} from "../../lib/http.client";

type ProductImageUploadResponse = {
  imageUrl: string;
};

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

export function createProduct(product: ProductCreate) {
  return adminHttpRequest<ProductCreateResponse>("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function uploadProductImage(productId: string, file: File) {
  const formData = new FormData();
  formData.set("image", file);

  return multipartRequest<ProductImageUploadResponse>(
    `/products/${productId}/images`,
    formData,
  );
}

export function removeProductImage(productId: string) {
  return adminHttpRequest<ProductUpdateResponse>(`/products/${productId}/image`, {
    method: "DELETE",
  });
}
