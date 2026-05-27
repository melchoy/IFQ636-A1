import type { ProductListResponse } from "@otbt/types";
import { Router } from "express";

import { listProducts } from "../../modules/products/product.service.js";

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
