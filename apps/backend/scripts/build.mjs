import { rm } from "node:fs/promises";

import { build } from "esbuild";

const external = [
  "bcryptjs",
  "cors",
  "dotenv",
  "express",
  "jsonwebtoken",
  "mongoose",
  "multer",
  "nodemailer",
];

await rm("dist", { force: true, recursive: true });

await build({
  bundle: true,
  entryPoints: ["src/server.ts"],
  external,
  format: "esm",
  logLevel: "info",
  outfile: "dist/server.js",
  packages: "bundle",
  platform: "node",
  sourcemap: true,
  target: "node24",
});
