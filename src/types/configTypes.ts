import { Rensa } from "../index.js";
import { LayerWithConfig } from "./routeTypes";

export type RensaConfig = {
  mode?: "manual" | "files";
  app?: Rensa;
  port: number;
  routesDir?: string;
  layersDir?: string;
  layers: LayerWithConfig[];
  builtins?: string[];
};
