import { Router } from "express";

import { storefrontAuthRouter } from "./auth.js";
import { storefrontCustomersRouter } from "./customers.js";
import { storefrontProductsRouter } from "./products.js";

export const storefrontRouter = Router();

storefrontRouter.use("/auth", storefrontAuthRouter);
storefrontRouter.use("/customers", storefrontCustomersRouter);
storefrontRouter.use("/products", storefrontProductsRouter);
