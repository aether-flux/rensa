import { Handler, Layer } from "../types/routeTypes.js";
export declare class Server {
    private router;
    private server?;
    private renderEngine?;
    private renderFolder?;
    constructor();
    use(middleware: Layer): void;
    useBuiltin(midd: string, ...opts: any[]): void;
    viewEngine(engine: string, folder?: string): void;
    get(path: string, ...handlers: Handler[]): void;
    post(path: string, ...handlers: Handler[]): void;
    put(path: string, ...handlers: Handler[]): void;
    patch(path: string, ...handlers: Handler[]): void;
    delete(path: string, ...handlers: Handler[]): void;
    notFound(handler: Handler): void;
    createServer(): void;
    listen(port: number, callback?: () => void): void;
}
