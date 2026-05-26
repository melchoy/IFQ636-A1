import { spawn } from "node:child_process";

let devProcess;
let cleaningUp = false;
let shuttingDown = false;

function spawnCommand(command, args) {
  return spawn(command, args, {
    stdio: "inherit",
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
  await run("docker", ["compose", "up", "-d", "nginx"]);

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
