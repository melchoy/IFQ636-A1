import type { AdminProductListResponse } from "@otbt/types";
import { Router } from "express";

import { requireAdmin } from "../../middleware/require-admin.js";
import { listProducts } from "../../modules/products/product.service.js";

export const adminProductsRouter = Router();

adminProductsRouter.get("/", requireAdmin, async (_req, res, next) => {
  try {
    const products = await listProducts();
    const response: AdminProductListResponse = { products };

    res.json(response);
  } catch (error) {
    next(error);
  }
});
