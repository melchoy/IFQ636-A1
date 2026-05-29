import type { Product } from "./product.entity.js";

export type ProductListItem = Pick<
  Product,
  "id" | "name" | "description" | "imageUrl" | "price"
>;

export interface ProductListResponse {
  products: ProductListItem[];
}

export type ProductDetail = Pick<
  Product,
  | "id"
  | "name"
  | "sku"
  | "description"
  | "imageUrl"
  | "price"
  | "stock"
  | "status"
  | "visibility"
>;

export interface ProductDetailResponse {
  product: ProductDetail;
}
