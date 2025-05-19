import { Rensa } from "../../index.js";
import { RensaConfig } from "../../types/configTypes.js";
import { errorHandler } from "../../utils/errorHandler.js"
import { createServerFromConfig } from "../utils/createServerFromConfig.js";
import { loadConfig } from "../utils/loadConfig.js";
import chalk from "chalk";

export const run = async (root?: string) => {
  try {
    const config: RensaConfig = await loadConfig(root);
    let app: Rensa;

    if (!config.port) {
      throw new Error("A 'port' must be provided in the config.\nIn your rensa.config.js, add this-- port: process.env.PORT || 5000");
    }

    if (!config.mode || config.mode === "manual") {
      app = config.app as Rensa;

      if (!app) {
        throw new Error("In manual mode, you must provide an 'app' instance.\nIn your rensa.config.js, add a field-- app: app\nAnd create this 'app' instance as-- const app = new Rensa()");
      }

      app.listen(config.port, () => {
        console.log(`\n${chalk.yellow("[rensa]")} Server started at port ${config.port}...\n`);
      });
    } else if (config.mode === "files") {
      app = new Rensa();
      createServerFromConfig(app, config);

      app.listen(config.port, () => {
        console.log(`\n${chalk.yellow("[rensa]")} Server started at port ${config.port}...\n`);
      });
    }
  } catch (e) {
    errorHandler(e);
  }
}
