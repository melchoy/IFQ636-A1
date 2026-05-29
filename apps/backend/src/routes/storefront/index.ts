import { Router } from "express";

import { storefrontCustomersRouter } from "./customers.js";
import { storefrontProductsRouter } from "./products.js";

export const storefrontRouter = Router();

storefrontRouter.use("/customers", storefrontCustomersRouter);
storefrontRouter.use("/products", storefrontProductsRouter);
