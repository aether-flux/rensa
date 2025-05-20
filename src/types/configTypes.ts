import { Rensa } from "../index.js";
import { Layer, LayerConfig } from "./routeTypes";

export type ConfigLayer = [Layer, LayerConfig];

export type RensaConfig = {
  mode?: "manual" | "compose";
  app?: Rensa;
  port: number;
  staticDir?: string;
  viewEngine?: string;
  views?: string;
  routesDir?: string;
  layersDir?: string;
  layers: ConfigLayer[];
  builtins?: [string, ...any][];
};
