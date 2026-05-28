import type { ProductDetailResponse, ProductListResponse } from "@otbt/types";
import { Router } from "express";

import { HttpError } from "../../middleware/error-handler.js";
import { getProduct, listProducts } from "../../modules/products/product.service.js";

export const storefrontProductsRouter = Router();

storefrontProductsRouter.get("/", async (_req, res, next) => {
  try {
    const products = await listProducts({
      status: "active",
      visibility: "public",
    });

    const response: ProductListResponse = {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
      })),
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

storefrontProductsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await getProduct(req.params.productId, {
      status: "active",
      visibility: "public",
    });

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    const response: ProductDetailResponse = {
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        stock: product.stock,
        status: product.status,
        visibility: product.visibility,
      },
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});
