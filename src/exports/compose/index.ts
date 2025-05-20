import { Handler, RouteConfig } from "../../types/routeTypes.js";

export const route = (handler: Handler, config?: RouteConfig) => {
  return { handler, config };
}
