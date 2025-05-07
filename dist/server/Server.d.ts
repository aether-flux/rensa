import { Handler, Layer, LayerConfig } from "../types/routeTypes.js";
export declare class Server {
    private router;
    private server?;
    private renderEngine?;
    private renderFolder?;
    private presets;
    constructor();
    use(middleware: Layer, config?: LayerConfig): void;
    useBuiltin(midd: string, ...args: (LayerConfig | any)[]): void;
    createPreset(presetName: string, ...layers: Layer[]): void;
    usePreset(presetName: string, config?: LayerConfig): void;
    viewEngine(engine: string, folder?: string): void;
    get(path: string, ...handlers: Function[]): void;
    post(path: string, ...handlers: Function[]): void;
    put(path: string, ...handlers: Function[]): void;
    patch(path: string, ...handlers: Function[]): void;
    delete(path: string, ...handlers: Function[]): void;
    notFound(handler: Handler): void;
    createServer(): void;
    listen(port: number, callback?: () => void): void;
}
