import type {
  AdminProductDetailResponse,
  AdminProductListResponse,
  AdminProductUpdateRequest,
  AdminProductUpdateResponse,
} from "@otbt/types";
import { Router } from "express";
import { Error as MongooseError } from "mongoose";

import { HttpError } from "../../middleware/error-handler.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import {
  getProduct,
  listProducts,
  updateProduct,
} from "../../modules/products/product.service.js";

export const adminProductsRouter = Router();

function handleProductRouteError(error: unknown, next: (error: unknown) => void) {
  if (error instanceof MongooseError.ValidationError) {
    next(new HttpError(400, error.message));
    return;
  }

  next(error);
}

function getProductIdParam(productId: string | string[]) {
  return Array.isArray(productId) ? productId[0] : productId;
}

adminProductsRouter.get("/", requireAdmin, async (_req, res, next) => {
  try {
    const products = await listProducts();
    const response: AdminProductListResponse = { products };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

adminProductsRouter.get("/:productId", requireAdmin, async (req, res, next) => {
  try {
    const productId = getProductIdParam(req.params.productId);
    const product = await getProduct(productId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    const response: AdminProductDetailResponse = { product };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

adminProductsRouter.patch("/:productId", requireAdmin, async (req, res, next) => {
  try {
    const productId = getProductIdParam(req.params.productId);
    const product = await updateProduct(
      productId,
      req.body as AdminProductUpdateRequest,
    );

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    const response: AdminProductUpdateResponse = { product };

    res.json(response);
  } catch (error) {
    handleProductRouteError(error, next);
  }
});
