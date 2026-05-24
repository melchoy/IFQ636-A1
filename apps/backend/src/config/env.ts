import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env") });
dotenv.config();

export const env = {
  port: Number(process.env.BACKEND_PORT ?? process.env.PORT ?? 3000),
  clientOrigins: (process.env.CLIENT_ORIGINS ?? "http://localhost:5173,http://localhost:5174")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
};
