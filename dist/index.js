import chalk from 'chalk';
import { loadEnv } from "./middlewares/envars.js";
import { Server } from "./server/Server.js";
import { walk } from './utils/fileWalker.js';
import { fileParser } from './utils/fileParser.js';
import { pathToFileURL } from 'url';
export class Rensa {
    constructor() {
        this.app = new Server();
        this.createServer = this.app.createServer;
    }
    use(...args) {
        let config;
        let layers;
        const last = args[args.length - 1];
        if (last &&
            typeof last === "object" &&
            !Array.isArray(last) &&
            !(last instanceof Function) &&
            "scope" in last) {
            config = last;
            layers = args.slice(0, -1);
        }
        else {
            layers = args;
        }
        if (config && config.scope && config.scope[0] !== "/") {
            console.log(`${chalk.yellow("WARN:")} Scope paths should start with '/'.`);
        }
        layers.forEach(l => this.app.use(l, config));
    }
    useBuiltin(midd, ...opts) {
        this.app.useBuiltin(midd, ...opts);
    }
    createPreset(presetName, ...layers) {
        this.app.createPreset(presetName, ...layers);
    }
    usePreset(presetName, config) {
        if (config && config.scope && config.scope[0] !== "/") {
            console.log(`${chalk.yellow("WARN:")} Scope paths should start with '/'.`);
        }
        this.app.usePreset(presetName, config);
    }
    viewEngine(engine, folder = 'views') {
        this.app.viewEngine(engine, folder);
    }
    get(path, ...handlers) {
        this.app.get(path, ...handlers);
    }
    post(path, ...handlers) {
        this.app.post(path, ...handlers);
    }
    put(path, ...handlers) {
        this.app.put(path, ...handlers);
    }
    patch(path, ...handlers) {
        this.app.patch(path, ...handlers);
    }
    delete(path, ...handlers) {
        this.app.delete(path, ...handlers);
    }
    notFound(handler) {
        this.app.notFound(handler);
    }
    listen(port, callback) {
        this.createServer();
        this.app.listen(port, callback);
    }
    async compose(config) {
        const routes = config?.routes || "routes";
        // Apply Builtins
        for (const b of config?.builtins || [])
            this.useBuiltin(b);
        // Apply Layers
        if (config?.layers) {
            const layerFiles = await walk(config.layers);
            for (const file of layerFiles) {
                const layer = (await import(file)).default;
                this.use(layer);
            }
        }
        // Apply Routes
        const routeFiles = await walk(routes);
        for (const { method, route, file } of fileParser(routeFiles, routes)) {
            const handler = (await import(pathToFileURL(file).href)).default;
            const normalizedRoute = route.endsWith("/") && route !== "/" ? route.slice(0, -1) : route;
            this[method](normalizedRoute, handler);
        }
    }
}
export function env() {
    loadEnv();
}
