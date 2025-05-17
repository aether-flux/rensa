import { Server } from "./server/Server.js";
import { ComposeConfig, Handler, Layer, LayerConfig } from "./types/routeTypes.js";
export type { Request, Response } from "./types/httpTypes.js";
export type { Handler, Layer };
export declare class Rensa {
    app: Server;
    createServer: () => void;
    constructor();
    use(...layers: Layer[]): void;
    use(...layersAndConfig: [...Layer[], LayerConfig]): void;
    useBuiltin(midd: string, ...opts: any[]): void;
    createPreset(presetName: string, ...layers: Layer[]): void;
    usePreset(presetName: string, config?: LayerConfig): void;
    viewEngine(engine: string, folder?: string): void;
    get(path: string, ...handlers: Function[]): void;
    post(path: string, ...handlers: Function[]): void;
    put(path: string, ...handlers: Function[]): void;
    patch(path: string, ...handlers: Function[]): void;
    delete(path: string, ...handlers: Function[]): void;
    notFound(handler: Handler): void;
    listen(port: number, callback: () => void): void;
    compose(config?: ComposeConfig): Promise<void>;
}
export declare function env(): void;
