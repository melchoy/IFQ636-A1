import { isValidObjectId } from "mongoose";
import type { Product, ProductUpdate } from "@otbt/types";

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

export async function getProduct(productId: string): Promise<Product | null> {
  if (!isValidObjectId(productId)) {
    return null;
  }

  const product = await ProductModel.findById(productId).lean<ProductRecord>().exec();

  return product ? serializeProduct(product) : null;
}

export async function updateProduct(
  productId: string,
  product: ProductUpdate,
): Promise<Product | null> {
  if (!isValidObjectId(productId)) {
    return null;
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(productId, product, {
    new: true,
    runValidators: true,
  })
    .lean<ProductRecord>()
    .exec();

  return updatedProduct ? serializeProduct(updatedProduct) : null;
}

export async function clearProductImage(productId: string): Promise<Product | null> {
  if (!isValidObjectId(productId)) {
    return null;
  }

  const updatedProduct = await ProductModel.findByIdAndUpdate(
    productId,
    { $unset: { imageUrl: "" } },
    {
      new: true,
      runValidators: true,
    },
  )
    .lean<ProductRecord>()
    .exec();

  return updatedProduct ? serializeProduct(updatedProduct) : null;
}
