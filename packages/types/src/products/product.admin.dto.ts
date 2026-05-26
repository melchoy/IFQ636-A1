import type { Product, ProductCreate, ProductUpdate } from "./product.entity.js";

export type AdminProductListItem = Product;

export interface AdminProductListResponse {
  products: AdminProductListItem[];
}

export type AdminProductDetail = Product;

export interface AdminProductDetailResponse {
  product: AdminProductDetail;
}

export type AdminProductCreateRequest = ProductCreate;

export interface AdminProductCreateResponse {
  product: AdminProductDetail;
}

export type AdminProductUpdateRequest = ProductUpdate;

export interface AdminProductUpdateResponse {
  product: AdminProductDetail;
}
