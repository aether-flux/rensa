import { errorHandler } from "../../utils/errorHandler.js";
import { fileParser } from "../../utils/fileParser.js";
import { walk } from "../../utils/fileWalker.js";
import chalk from "chalk";
import path from "path";
import { loadConfig } from "../utils/loadConfig.js";

export const routes = async (root?: string) => {
  try {
    root = root || process.cwd();
    const config = await loadConfig(root);

    if (config.mode === "manual") {
      throw new Error(`This command is only available in file-based routing mode.\nSwitch to file-based routing to use route helper commands.`);
    }

    const files = await walk(path.join(root, config.routes || "routes"));
    const parsedFiles = fileParser(files, config.routes || "routes");

    console.log(`\n${chalk.yellow("[rensa]")} Defined routes:\n`);
    for (const { method, route, file } of parsedFiles) {
      if (method === "notFound") continue;

      console.log(`${chalk.blue(method.toUpperCase())} ${route}`);
    }
  } catch (e) {
    errorHandler(e);
  }
}
