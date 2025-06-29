import { ComposeLayer, ComposeRoute, ComposeRouteConfig, Handler, Layer, LayerConfig } from "../../types/routeTypes.js";

export const route = (handler: Handler, config?: ComposeRouteConfig): ComposeRoute => {
  return { handler, config };
};

export const layer = (layerFn: Layer, config?: LayerConfig): ComposeLayer => {
  return { layerFn, config };
};
