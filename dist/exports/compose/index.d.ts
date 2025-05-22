import { ComposeRouteConfig, Handler, Layer, LayerConfig } from "../../types/routeTypes.js";
export declare const route: (handler: Handler, config?: ComposeRouteConfig) => {
    handler: Handler;
    config: ComposeRouteConfig | undefined;
};
export declare const layer: (layerFn: Layer, config?: LayerConfig) => {
    layerFn: Layer;
    config: LayerConfig | undefined;
};
