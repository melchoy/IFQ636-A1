import { Router } from "express";

import { storefrontAuthRouter } from "./auth.js";
import { storefrontCustomersRouter } from "./customers.js";
import { storefrontOrdersRouter } from "./orders.js";
import { storefrontProductsRouter } from "./products.js";

export const storefrontRouter = Router();

storefrontRouter.use("/auth", storefrontAuthRouter);
storefrontRouter.use("/customers", storefrontCustomersRouter);
storefrontRouter.use("/orders", storefrontOrdersRouter);
storefrontRouter.use("/products", storefrontProductsRouter);
