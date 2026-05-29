import { Router } from "express";

import { storefrontProductsRouter } from "./products.js";

export const storefrontRouter = Router();

storefrontRouter.use("/products", storefrontProductsRouter);
