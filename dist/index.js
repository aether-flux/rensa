import chalk from 'chalk';
import { loadEnv } from "./middlewares/envars.js";
import { Server } from "./server/Server.js";
import { walk } from './utils/fileWalker.js';
import { fileParser } from './utils/fileParser.js';
import { pathToFileURL } from 'url';
import { errorHandler } from './utils/errorHandler.js';
export class Rensa {
    constructor() {
        this.app = new Server();
        this.createServer = this.app.createServer;
    }
    use(...args) {
        try {
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
        catch (e) {
            errorHandler(e);
        }
    }
    useBuiltin(midd, ...opts) {
        try {
            this.app.useBuiltin(midd, ...opts);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    createPreset(presetName, ...layers) {
        try {
            this.app.createPreset(presetName, ...layers);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    usePreset(presetName, config) {
        try {
            if (config && config.scope && config.scope[0] !== "/") {
                console.log(`${chalk.yellow("WARN:")} Scope paths should start with '/'.`);
            }
            this.app.usePreset(presetName, config);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    viewEngine(engine, folder = 'views') {
        try {
            this.app.viewEngine(engine, folder);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    get(path, ...handlers) {
        try {
            this.app.get(path, ...handlers);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    post(path, ...handlers) {
        try {
            this.app.post(path, ...handlers);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    put(path, ...handlers) {
        try {
            this.app.put(path, ...handlers);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    patch(path, ...handlers) {
        try {
            this.app.patch(path, ...handlers);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    delete(path, ...handlers) {
        try {
            this.app.delete(path, ...handlers);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    notFound(handler) {
        try {
            this.app.notFound(handler);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    listen(port, callback) {
        try {
            this.createServer();
            this.app.listen(port, callback);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    async compose(config) {
        try {
            const routes = config?.routes || "routes";
            // Apply Builtins
            for (const b of config?.builtins || [])
                this.useBuiltin(b);
            // Apply Layers
            if (config?.layers) {
                const layerFiles = await walk(config.layers);
                for (const file of layerFiles) {
                    const layerImports = (await import(pathToFileURL(file).href));
                    const layer = layerImports.layer || layerImports.default;
                    const layerConfig = layerImports.config;
                    if (layerConfig) {
                        this.use(layer(), layerConfig);
                    }
                    else {
                        this.use(layer());
                    }
                }
            }
            // Apply Routes
            const routeFiles = await walk(routes);
            for (const { method, route, file } of fileParser(routeFiles, routes)) {
                const routeImports = (await import(pathToFileURL(file).href));
                const handler = routeImports.handler || routeImports.default;
                if (typeof handler !== "function") {
                    throw new Error(`Invalid handler in file ${file}. Expected a function export 'handler' or 'default'.`);
                }
                const routeConfig = routeImports.config;
                const routeLayers = routeConfig?.layers || [];
                // Handling 404 routes (notFound.js / notFound.ts)
                if (route === null && method === "notFound") {
                    this.notFound(handler);
                }
                else {
                    const normalizedRoute = route.endsWith("/") && route !== "/" ? route.slice(0, -1) : route; // Convert /home/ to /home
                    this[method](normalizedRoute, ...routeLayers, handler);
                }
            }
        }
        catch (e) {
            errorHandler(e);
        }
    }
}
export function env() {
    loadEnv();
}
