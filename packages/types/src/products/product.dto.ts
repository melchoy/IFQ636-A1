import type { Product } from "./product.entity.js";

export type AdminProductListItem = Product;

export interface AdminProductListResponse {
  products: AdminProductListItem[];
}
