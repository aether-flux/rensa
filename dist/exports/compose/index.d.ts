import { ComposeLayer, ComposeRoute, ComposeRouteConfig, Handler, Layer, LayerConfig } from "../../types/routeTypes.js";
export declare const route: (handler: Handler, config?: ComposeRouteConfig) => ComposeRoute;
export declare const layer: (layerFn: Layer, config?: LayerConfig) => ComposeLayer;
