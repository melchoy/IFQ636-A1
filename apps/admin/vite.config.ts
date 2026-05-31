import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";

const parseList = (value: string | undefined) =>
  value
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const readPort = (value: string | undefined, fallback: number) => {
  const port = Number(value);
  return Number.isInteger(port) && port > 0 ? port : fallback;
};

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, fileURLToPath(new URL("../../", import.meta.url)), ""), ...process.env };
  const backendTarget = `http://localhost:${readPort(env.BACKEND_PORT, 5102)}`;

  return {
    base: "/admin/",
    plugins: [react(), tailwindcss()],
    server: {
      host: "localhost",
      port: readPort(env.ADMIN_PORT, 5174),
      allowedHosts: parseList(env.VITE_ALLOWED_HOSTS),
      proxy: {
        "/api": {
          target: backendTarget,
          changeOrigin: true,
        },
        "/uploads": {
          target: backendTarget,
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
        {
          find: "@otbt/web",
          replacement: fileURLToPath(new URL("../../packages/web/src/index.ts", import.meta.url)),
        },
      ],
    },
  };
});
