import { Router } from "express";

import { attachCustomerContext } from "../../middleware/require-customer.js";
import { storefrontAuthRouter } from "./auth.js";
import { storefrontCustomersRouter } from "./customers.js";
import { storefrontOrdersRouter } from "./orders.js";
import { storefrontProductsRouter } from "./products.js";

export const storefrontRouter = Router();

storefrontRouter.use(attachCustomerContext);

storefrontRouter.use("/auth", storefrontAuthRouter);
storefrontRouter.use("/customers", storefrontCustomersRouter);
storefrontRouter.use("/orders", storefrontOrdersRouter);
storefrontRouter.use("/products", storefrontProductsRouter);
