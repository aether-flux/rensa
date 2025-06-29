import path from "path";
import fs from "fs";
import chalk from "chalk";
import { errorHandler } from "../../utils/errorHandler.js";
import { loadConfig } from "../utils/loadConfig.js";

const createRouteContent = (route: string, ts: boolean = false) => {
  let content;

  if (ts) {
    content = `import { route } from "rensa/compose";
import { Request, Response, ComposeRoute } from "rensa/types";

export default route((req: Request, res: Response) => {
  console.log("${`Route: ${route}`}");
  res.send({ message: "${`Route ${route}`}" });
}) as ComposeRoute;
`
  } else {
    content = `import { route } from "rensa/compose";

export default route((req, res) => {
  console.log("${`Route: ${route}`}");
  res.send({ message: "${`Route ${route}`}" });
});
`
  }

  return content;
}

export const routeAction = async (method: string, route: string, force: boolean = false, ts: boolean = false) => {
  try {
    const config = await loadConfig(process.cwd());

    if (config.mode === "manual") {
      throw new Error(`This command is only available in file-based routing mode.\nSwitch to file-based routing to use route helper commands.`);
    }

    const routesDir = config.routes || "routes";
    const normalizedRoute = (route as string).endsWith("/") && route !== "/" ? (route as string).slice(0, -1) : route;
    const routeParts = normalizedRoute.split("/");

    let routePath = path.join(process.cwd(), routesDir, ...routeParts, `${method.toLowerCase()}.${ts ? 'ts' : 'js'}`);
    const fileContent = createRouteContent(route, ts);

    if (fs.existsSync(routePath) && !force) {
      throw new Error(`Route already defined. If you wish to overwrite existing definitions, add the --force flag.`);
    }

    fs.mkdirSync(path.dirname(routePath), { recursive: true });
    fs.writeFileSync(routePath, fileContent);
    console.log(`\n${chalk.green("[rensa]")} Route created successfully!`);
  } catch (e) {
    errorHandler(e);
  }
}
