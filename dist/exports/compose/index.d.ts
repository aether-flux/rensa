import { Handler, RouteConfig } from "../../types/routeTypes.js";
export declare const route: (handler: Handler, config?: RouteConfig) => {
    handler: Handler;
    config: RouteConfig | undefined;
};
