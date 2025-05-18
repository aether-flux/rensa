import { Server } from "http";
import { errorHandler } from "../../utils/errorHandler.js"
import { run } from "./run.js";
import path from "path";
import chalk from "chalk";
import Watchpack from "watchpack";
import { ChildProcess, spawn } from "child_process";

let child: ChildProcess | null = null;
let reloadTimeout: NodeJS.Timeout | null = null;

const startProcess = async (root?: string) => {
  if (child) {
    child.kill();
  }

  child = spawn("node node_modules/rensa/dist/cli/main.js run", {
    stdio: "inherit",
    shell: true,
    cwd: root || process.cwd(),
  });
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const pad = (n: number) => String(n).padStart(2, "0");

  const hours = pad(date.getHours());
  const mins = pad(date.getMinutes());
  const secs = pad(date.getSeconds());

  return `${hours}:${mins}:${secs}`;
}

export const dev = async (root?: string) => {
  try {
    root = root || process.cwd();
    await startProcess(root);

    const watcher = new Watchpack({
      aggregateTimeout: 200,
      ignored: /node_modules|\.git|~$/,
    });

//     const watcher = chokidar.watch([
//       path.join(root, "**/*.js"),
//       path.join(root, "**/*.ts"),
//       "!" + path.join(root, "node_modules"),
//       "!" + path.join(root, "**/node_modules/**"),
//       "!" + path.join(root, "**/.git/**")
//     ], {
//         ignoreInitial: true,
//         persistent: true,
//         awaitWriteFinish: true,
//     });

    watcher.watch([], [root], Date.now());

    watcher.on('change', async (fp: any) => {
       //console.log(`File changed: ${path}`);
       //console.log(`Hot reloading...`);
       //await startProcess(root);

      // Clear previous timeout
      if (reloadTimeout) clearTimeout(reloadTimeout);

      // Debounce actual server restart
      reloadTimeout = setTimeout(async () => {
        const pathParts = fp.split("/");
        console.log(`\n${chalk.blue(`[${formatTime(Date.now())}]`)} File changed: ${path.relative(root || process.cwd(), fp)}`)
        console.log(`${chalk.blue(`[rensa]`)} Hot reloading...`);
        await startProcess(root);
      }, 200);
    });
  } catch (e) {
    errorHandler(e);
  }
}
