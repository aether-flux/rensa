import { Server } from "./server/Server.js";
import { Handler, Middleware } from "./types/routeTypes.js";
export declare class Rensa {
    app: Server;
    createServer: () => void;
    constructor();
    use(middleware: Middleware): void;
    useBuiltin(midd: string, ...opts: any[]): void;
    viewEngine(engine: string, folder?: string): void;
    get(path: string, ...handlers: Handler[]): void;
    post(path: string, ...handlers: Handler[]): void;
    put(path: string, ...handlers: Handler[]): void;
    patch(path: string, ...handlers: Handler[]): void;
    delete(path: string, ...handlers: Handler[]): void;
    notFound(handler: Handler): void;
    listen(port: number, callback: () => void): void;
}
export declare function env(): void;
