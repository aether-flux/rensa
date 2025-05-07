import chalk from 'chalk';
import { loadEnv } from "./middlewares/envars.js";
import { Server } from "./server/Server.js";
import { Handler, Layer, LayerConfig } from "./types/routeTypes.js";

export type { Request, Response } from "./types/httpTypes.js";
export type { Handler, Layer };

export class Rensa {
  app: Server;
  createServer: () => void;

  constructor () {
    this.app = new Server();
    this.createServer = this.app.createServer;
  }

  use(...layers: Layer[]): void;
  use(...layersAndConfig: [...Layer[], LayerConfig]): void;

  use (...args: (Layer | LayerConfig)[]): void {
    let config: LayerConfig | undefined;
    let layers: Layer[];

    const last = args[args.length - 1];

    if (
      last &&
      typeof last === "object" &&
      !Array.isArray(last) &&
      !(last instanceof Function) &&
      "scope" in last
    ) {
      config = last as LayerConfig;
      layers = args.slice(0, -1) as Layer[];
    } else {
      layers = args as Layer[];
    }

    if (config && config.scope && config.scope[0] !== "/") {
      console.log(`${chalk.yellow("WARN:")} Scope paths should start with '/'.`);
    }

    layers.forEach(l => this.app.use(l, config));
  }

  useBuiltin (midd: string, ...opts: any[]) {
    this.app.useBuiltin(midd, ...opts);
  }

  createPreset (presetName: string, ...layers: Layer[]) {
    this.app.createPreset(presetName, ...layers);
  }

  usePreset (presetName: string, config?: LayerConfig) {
    if (config && config.scope && config.scope[0] !== "/") {
      console.log(`${chalk.yellow("WARN:")} Scope paths should start with '/'.`);
    }

    this.app.usePreset(presetName, config);
  }

  viewEngine (engine: string, folder: string = 'views') {
    this.app.viewEngine(engine, folder);
  }

  get (path: string, ...handlers: Function[]) {
    this.app.get(path, ...handlers);
  }

  post (path: string, ...handlers: Function[]) {
    this.app.post(path, ...handlers);
  }

  put (path: string, ...handlers: Function[]) {
    this.app.put(path, ...handlers);
  }

  patch (path: string, ...handlers: Function[]) {
    this.app.patch(path, ...handlers);
  }

  delete (path: string, ...handlers: Function[]) {
    this.app.delete(path, ...handlers);
  }

  notFound (handler: Handler) {
    this.app.notFound(handler);
  }

  listen (port: number, callback: () => void) {
    this.createServer();
    this.app.listen(port, callback);
  }
}

export function env (): void {
  loadEnv();
}
