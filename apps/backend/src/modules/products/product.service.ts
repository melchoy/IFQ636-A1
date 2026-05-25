import type { Product } from "@otbt/types";

import { ProductModel, type ProductDocument } from "./product.model.js";

type ProductRecord = ProductDocument & {
  _id: { toString(): string };
};

function serializeProduct(product: ProductRecord): Product {
  return {
    id: product._id.toString(),
    name: product.name,
    sku: product.sku,
    description: product.description,
    imageUrl: product.imageUrl,
    price: product.price,
    stock: product.stock,
    status: product.status,
    visibility: product.visibility,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function listProducts(): Promise<Product[]> {
  const products = await ProductModel.find()
    .sort({ name: 1 })
    .lean<ProductRecord[]>()
    .exec();

  return products.map((product) => serializeProduct(product));
}
