import { Request, Response } from "./httpTypes";

// Layer types
export type Layer = (req: Request, res: Response, next: () => void) => void | Promise<void>;

export type LayerConfig = { scope?: string[] };

export type LayerWithConfig = {
  fn: Layer;
  config?: LayerConfig;
};

// Route-related data type
export type RouteData = {
  middlewares: Layer[];
  handler: (req: Request, res: Response) => void | Promise<void>;
};

// Method handler type
export type Handler = (req: Request, res: Response) => void | Promise<void>;

// Route node type (in Trie)
export type RouteNode = {
  children: { [key: string]: RouteNode };
  eor: boolean;
}

// Route hashmap type
export type RouteMap = { [key: string]: RouteNode };

// Route Config (in Manual mode)
export type RouteConfig = {
  path: string;
  layers?: Layer[];
};

// Route Config (in Compose mode)
export type ComposeRouteConfig = {
  layers?: Layer[];
};

// Compose Types

// Compose Route
export type ComposeRoute = {
  handler: Handler;
  config?: ComposeRouteConfig;
};

// Compose Layer
export type ComposeLayer = {
  layerFn: Layer;
  config?: LayerConfig;
};

// Config for File-Based Routing (compose)
export type ComposeConfig = {
  routes?: string;
  layers?: string;
  builtins?: [string, ...any][];
  staticDir?: string;
  viewEngine?: string;
  views?: string;
};

