import type {
  AdminProductCreateRequest,
  AdminProductCreateResponse,
  AdminProductDetailResponse,
  AdminProductListResponse,
  AdminProductUpdateRequest,
  AdminProductUpdateResponse,
} from "@otbt/types";
import { Router, type RequestHandler } from "express";
import { Error as MongooseError } from "mongoose";
import multer from "multer";

import { HttpError } from "../../middleware/error-handler.js";
import { requireAdmin } from "../../middleware/require-admin.js";
import {
  deleteProductImage,
  storeProductImage,
} from "../../modules/product-images/product-image.service.js";
import {
  clearProductImage,
  createProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../../modules/products/product.service.js";

export const adminProductsRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
      return;
    }

    cb(new HttpError(400, "Only image uploads are allowed"));
  },
});

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

const requireExistingProduct: RequestHandler = async (req, _res, next) => {
  try {
    const productId = getProductIdParam(req.params.productId);
    const product = await getProduct(productId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    next();
  } catch (error) {
    next(error);
  }
};

adminProductsRouter.post(
  "/:productId/images",
  requireAdmin,
  requireExistingProduct,
  upload.single("image"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new HttpError(400, "Image file is required");
      }

      const storedImage = await storeProductImage({
        buffer: req.file.buffer,
        originalName: req.file.originalname,
      });

      res.status(201).json({ imageUrl: storedImage.imageUrl });
    } catch (error) {
      next(error);
    }
  },
);

adminProductsRouter.delete("/:productId/image", requireAdmin, async (req, res, next) => {
  try {
    const productId = getProductIdParam(req.params.productId);
    const product = await getProduct(productId);

    if (!product) {
      throw new HttpError(404, "Product not found");
    }

    if (product.imageUrl) {
      await deleteProductImage(product.imageUrl);
    }

    const updatedProduct = await clearProductImage(productId);

    if (!updatedProduct) {
      throw new HttpError(404, "Product not found");
    }

    const response: AdminProductUpdateResponse = { product: updatedProduct };

    res.json(response);
  } catch (error) {
    handleProductRouteError(error, next);
  }
});

adminProductsRouter.get("/", requireAdmin, async (_req, res, next) => {
  try {
    const products = await listProducts();
    const response: AdminProductListResponse = { products };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

adminProductsRouter.post("/", requireAdmin, async (req, res, next) => {
  try {
    const product = await createProduct(req.body as AdminProductCreateRequest);
    const response: AdminProductCreateResponse = { product };

    res.status(201).json(response);
  } catch (error) {
    handleProductRouteError(error, next);
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
