import cors from "cors";
import express from "express";

import { env } from "./config/env.js";
import { healthRouter } from "./routes/health.js";

export const app = express();

app.use(cors({ origin: env.clientOrigin }));
app.use(express.json());

app.use("/health", healthRouter);
