import path from "path";
import fs from "fs";
import chalk from "chalk";
import { errorHandler } from "../../utils/errorHandler.js";

const configContent = `export default {
  // Mode of using Rensa. "files" means automatic file-based routing. Switch to "manual" for complete control.
  mode: "compose",
  // OR
  // mode: "manual",

  // In manual mode, you must provide your app instance here, to enable using commands like 'npx rensa run'.
  // Export the app instance from your main file (export const app = new Rensa()).
  // app: app,

  // Directory where routes will be defined (for "files" mode). If nothing is provided, default is "routes/".
  // routesDir: "routes",

  // Directory where layers will be defined (for "files" mode). If nothing is provided, Layers won't get applied by default.
  // layersDir: "layers/global",

  // Apply any layers manually (works in "files" mode only)
  // layers: [[layerFn1, { scope: ["/"] }], [layerFn2, { scope: ["/home"] }]],

  // Builtin Layers (if any) (works in "files" mode only)
  // builtins: [["logger"], ["rate limiter", 60000, 20]],

  // Set view engine and views directory
  // If 'views' is provided, you must provide a 'viewEngine' as well. Available engines: 'ejs'
  // viewEngine: 'ejs',
  // views: 'views',    // Optional if you provide 'viewEngine', defaults to 'views'

  // Load static files
  // staticDir: 'public',

  // Port where the server would listen to. Must be provided.
  port: process.env.PORT || 5000,
}`;

export const init = (force: boolean) => {
  try {
    const configPath = path.join(process.cwd(), "rensa.config.js");

    if (fs.existsSync(configPath) && !force) {
      throw new Error(`Config file already exists. To overwrite existing config, use the --force flag.`);
    }

    fs.writeFileSync(configPath, configContent);
    console.log(`\n${chalk.green("[rensa]")} Config file created successfully!`);
  } catch (e) {
    errorHandler(e);
  }
}
