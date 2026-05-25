import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

const parseList = (value: string | undefined) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL("../../", import.meta.url)), "");

  return {
    base: "/admin/",
    plugins: [react(), tailwindcss()],
    server: {
      host: "localhost",
      allowedHosts: parseList(env.VITE_ALLOWED_HOSTS),
      proxy: {
        "/api": {
          target: "http://localhost:5102",
          changeOrigin: true,
        },
        "/uploads": {
          target: "http://localhost:5102",
          changeOrigin: true,
        },
      },
    },
    resolve: {
      dedupe: ["react", "react-dom"],
      alias: [
        {
          find: "@/components/ui",
          replacement: fileURLToPath(new URL("../../packages/ui/src/components/ui", import.meta.url)),
        },
        {
          find: "@/hooks",
          replacement: fileURLToPath(new URL("../../packages/ui/src/hooks", import.meta.url)),
        },
        {
          find: "@/lib/utils",
          replacement: fileURLToPath(new URL("../../packages/ui/src/lib/utils.ts", import.meta.url)),
        },
        {
          find: "@otbt/ui/globals.css",
          replacement: fileURLToPath(new URL("../../packages/ui/src/styles/globals.css", import.meta.url)),
        },
        {
          find: "@otbt/types",
          replacement: fileURLToPath(new URL("../../packages/types/src/index.ts", import.meta.url)),
        },
        {
          find: "@",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
        {
          find: "@otbt/ui",
          replacement: fileURLToPath(new URL("../../packages/ui/src/index.ts", import.meta.url)),
        },
      ],
    },
  };
});
