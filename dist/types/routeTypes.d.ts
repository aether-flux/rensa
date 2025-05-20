import { Request, Response } from "./httpTypes";
export type Layer = (req: Request, res: Response, next: () => void) => void | Promise<void>;
export type LayerConfig = {
    scope?: string[];
};
export type LayerWithConfig = {
    fn: Layer;
    config?: LayerConfig;
};
export type RouteData = {
    middlewares: Layer[];
    handler: (req: Request, res: Response) => void | Promise<void>;
};
export type Handler = (req: Request, res: Response) => void | Promise<void>;
export type RouteNode = {
    children: {
        [key: string]: RouteNode;
    };
    eor: boolean;
};
export type RouteMap = {
    [key: string]: RouteNode;
};
export type RouteConfig = {
    layers: Layer[];
};
export type ComposeConfig = {
    routes?: string;
    layers?: string;
    builtins?: [string, ...any][];
    staticDir?: string;
    viewEngine?: string;
    views?: string;
};
