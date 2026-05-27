import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { adminRouter } from "./routes/admin/index.js";
import { healthRouter } from "./routes/health.js";
import { storefrontRouter } from "./routes/storefront/index.js";

export const app = express();

app.use(cors({ origin: env.clientOrigins }));
app.use(express.json());
app.use("/uploads", express.static(env.uploadsDir));

app.use("/health", healthRouter);
app.use("/api/admin", adminRouter);
app.use("/api/storefront", storefrontRouter);

app.use(errorHandler);
