import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

let devProcess;
let cleaningUp = false;
let shuttingDown = false;

const rootDir = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const envPath = path.join(rootDir, ".env");

function parseDotEnv(raw) {
  return Object.fromEntries(
    raw
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const equalsAt = line.indexOf("=");
        if (equalsAt === -1) {
          return [line, ""];
        }

        const key = line.slice(0, equalsAt).trim();
        const value = line.slice(equalsAt + 1).trim().replace(/^['"]|['"]$/g, "");
        return [key, value];
      }),
  );
}

async function loadDotEnv() {
  try {
    const raw = await fs.readFile(envPath, "utf8");
    for (const [key, value] of Object.entries(parseDotEnv(raw))) {
      process.env[key] ??= value;
    }
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}

function readPort(key, fallback) {
  const value = Number(process.env[key] ?? fallback);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }
  return value;
}

function logPorts() {
  process.stdout.write(
    [
      `Compose project: ${process.env.COMPOSE_PROJECT_NAME ?? "ifq683-a1"}`,
      `nginx: http://localhost:${readPort("NGINX_PORT", 80)}`,
      `storefront: http://localhost:${readPort("STOREFRONT_PORT", 5473)}`,
      `admin: http://localhost:${readPort("ADMIN_PORT", 5474)}/admin/`,
      `backend: http://localhost:${readPort("BACKEND_PORT", 5402)}`,
      `mailpit: http://mailpit.localhost:${readPort("NGINX_PORT", 80)}`,
      `smtp: localhost:${readPort("SMTP_PORT", 1025)}`,
      "",
    ].join("\n"),
  );
}

function spawnCommand(command, args) {
  return spawn(command, args, {
    stdio: "inherit",
    cwd: rootDir,
  });
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawnCommand(command, args);

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with ${code ?? signal}`));
    });
  });
}

async function cleanup() {
  if (cleaningUp) {
    return;
  }

  cleaningUp = true;

  if (devProcess && !devProcess.killed) {
    devProcess.kill("SIGTERM");
  }

  await run("docker", ["compose", "down"]);
  process.stdout.write("\n");
}

async function shutdown(exitCode) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  try {
    await cleanup();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }

  process.stdin.pause();
  process.stdout.write("Dev stack stopped.\n\n");

  setImmediate(() => {
    process.exit(exitCode);
  });
}

async function main() {
  await loadDotEnv();
  logPorts();
  await run("docker", ["compose", "up", "-d"]);

  devProcess = spawnCommand("pnpm", [
    "--parallel",
    "--filter",
    "@otbt/storefront",
    "--filter",
    "@otbt/admin",
    "--filter",
    "@otbt/backend",
    "dev",
  ]);

  process.on("SIGINT", () => {
    void shutdown(130);
  });

  process.on("SIGTERM", () => {
    void shutdown(143);
  });

  devProcess.on("error", async (error) => {
    console.error(error);
    await shutdown(1);
  });

  devProcess.on("exit", async (code, signal) => {
    if (cleaningUp) {
      return;
    }

    if (signal === "SIGINT") {
      await shutdown(130);
      return;
    }

    if (signal === "SIGTERM") {
      await shutdown(143);
      return;
    }

    await shutdown(code ?? 0);
  });
}

main().catch(async (error) => {
  console.error(error);
  await shutdown(1);
});
