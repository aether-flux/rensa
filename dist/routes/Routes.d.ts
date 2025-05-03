import { Handler, Middleware } from "../types/routeTypes.js";
export declare class Router {
    private middlewares;
    private routes;
    private store;
    private notFoundHandler;
    constructor();
    setNotFound(handler: Handler): void;
    add(method: string, path: string, ...handlers: Function[]): Promise<void>;
    use(middleware: Middleware): void;
    handle(method: string, path: string, req: any, res: any): Promise<void>;
    handleRoute(method: string, path: string, req: any, res: any): Promise<void>;
}
