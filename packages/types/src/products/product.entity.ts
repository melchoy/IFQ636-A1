import type {
  PRODUCT_STATUSES,
  PRODUCT_VISIBILITIES,
} from "./product.constants.js";

export type ProductStatus = (typeof PRODUCT_STATUSES)[number];
export type ProductVisibility = (typeof PRODUCT_VISIBILITIES)[number];

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  imageUrl?: string;
  price: number;
  stock: number;
  status: ProductStatus;
  visibility: ProductVisibility;
  createdAt: string;
  updatedAt: string;
}

export const EDITABLE_PRODUCT_FIELDS = [
  "name",
  "sku",
  "description",
  "imageUrl",
  "price",
  "stock",
  "status",
  "visibility",
] as const satisfies readonly (keyof Product)[];

export type EditableProductField = (typeof EDITABLE_PRODUCT_FIELDS)[number];

export type EditableProduct = Pick<Product, EditableProductField>;

export type ProductCreate = EditableProduct;

export type ProductUpdate = Partial<EditableProduct>;
