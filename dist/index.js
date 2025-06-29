import chalk from 'chalk';
import { Server } from "./server/Server.js";
import { walk } from './utils/fileWalker.js';
import { fileParser } from './utils/fileParser.js';
import { pathToFileURL } from 'url';
import path from "path";
import fs from "fs";
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
    static(folder = 'public') {
        try {
            this.use((req, res, next) => {
                if (req.url?.startsWith(`/${folder}/`)) {
                    const filePath = path.join(process.cwd(), req.url);
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            res.statusCode = 404;
                            return res.end("File not found");
                        }
                        res.end(data);
                    });
                }
                else {
                    next();
                }
            });
        }
        catch (e) {
            errorHandler(e);
        }
    }
    get(config, handler) {
        try {
            this.app.get(config.path, ...config.layers || [], handler);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    post(config, handler) {
        try {
            this.app.post(config.path, ...config.layers || [], handler);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    put(config, handler) {
        try {
            this.app.put(config.path, ...config.layers || [], handler);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    patch(config, handler) {
        try {
            this.app.patch(config.path, ...config.layers || [], handler);
        }
        catch (e) {
            errorHandler(e);
        }
    }
    delete(config, handler) {
        try {
            this.app.delete(config.path, ...config.layers || [], handler);
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
                this.useBuiltin(b[0], ...b.slice(1));
            // Apply Layers
            if (config?.layers) {
                const layerFiles = await walk(config.layers);
                for (const file of layerFiles) {
                    const layerImports = (await import(pathToFileURL(file).href)).default;
                    const layer = layerImports.layerFn;
                    const layerConfig = layerImports.config;
                    if (layerConfig) {
                        this.use(layer, layerConfig);
                    }
                    else {
                        this.use(layer);
                    }
                }
            }
            // Apply views
            if (config?.views && !config?.viewEngine) {
                throw new Error(`A view engine must be provided if you specify a 'views' directory.\nAvailable view engines: 'ejs'`);
            }
            if (config?.viewEngine) {
                this.viewEngine(config?.viewEngine, config?.views);
            }
            // Load static files
            if (config?.staticDir) {
                this.static(config?.staticDir);
            }
            // Apply Routes
            const routeFiles = await walk(routes);
            const parsedRoutes = fileParser(routeFiles, routes);
            parsedRoutes.sort((a, b) => (a.route) ? a.route.length - b.route.length : 0);
            for (const { method, route, file } of parsedRoutes) {
                console.log("Registering route: ", route);
                const routeImports = (await import(pathToFileURL(file).href)).default;
                const handler = routeImports?.handler;
                if (typeof handler !== "function") {
                    throw new Error(`Invalid handler in file ${file}. Expected a method handler and config within 'route()' as default export.\nMake sure the file exports this: export default route((req, res) => { // method handler }, { // any route config });`);
                }
                const routeConfig = routeImports?.config;
                const routeLayers = routeConfig?.layers || [];
                // Handling 404 routes (notFound.js / notFound.ts)
                if (!route || typeof route !== "string") {
                    if (method === "notFound") {
                        this.notFound(handler);
                    }
                    else {
                        throw new Error(`Route is undefined or invalid in file: ${file}`);
                    }
                }
                else {
                    const normalizedRoute = route.endsWith("/") && route !== "/" ? route.slice(0, -1) : route; // Convert /home/ to /home
                    this[method]({
                        path: normalizedRoute,
                        layers: routeLayers,
                    }, handler);
                }
            }
        }
        catch (e) {
            errorHandler(e);
        }
    }
}
