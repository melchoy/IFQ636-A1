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
  "id" | "name" | "description" | "imageUrl" | "price" | "stock"
>;

export interface ProductDetailResponse {
  product: ProductDetail;
}
