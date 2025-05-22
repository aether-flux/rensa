import { ComposeRouteConfig, Handler, Layer, LayerConfig } from "../../types/routeTypes.js";

export const route = (handler: Handler, config?: ComposeRouteConfig) => {
  return { handler, config };
};

export const layer = (layerFn: Layer, config?: LayerConfig) => {
  return { layerFn, config };
};
