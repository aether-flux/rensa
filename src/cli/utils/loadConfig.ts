import { pathToFileURL } from "url";
import path from "path";

export const loadConfig = async (root?: string) => {
  root = root || process.cwd();
  const configPath = path.join(root, "rensa.config.js");

  const mod = await import(pathToFileURL(configPath).href);
  return mod.default;
}
