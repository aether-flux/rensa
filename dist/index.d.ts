import { Server } from "./server/Server.js";
import { ComposeConfig, Handler, Layer, LayerConfig, RouteConfig } from "./types/routeTypes.js";
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
    static(folder?: string): void;
    get(config: RouteConfig, handler: Handler): void;
    post(config: RouteConfig, handler: Handler): void;
    put(config: RouteConfig, handler: Handler): void;
    patch(config: RouteConfig, handler: Handler): void;
    delete(config: RouteConfig, handler: Handler): void;
    notFound(handler: Handler): void;
    listen(port: number, callback: () => void): void;
    compose(config?: ComposeConfig): Promise<void>;
}
