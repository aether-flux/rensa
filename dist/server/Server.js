import http from "http";
import gpath from "path";
import fs from 'fs';
import mime from 'mime';
import chalk from 'chalk';
import { Router } from "../routes/Routes.js";
import { URLSearchParams } from "url";
import { cors } from "../middlewares/cors.js";
import { rateLimit } from "../middlewares/rateLimit.js";
import { logger } from "../middlewares/logger.js";
import { securityHeaders } from "../middlewares/security.js";
import { cookieParser } from "../middlewares/cookies.js";
import { session } from "../middlewares/session.js";
import { envars } from "../middlewares/envars.js";
export class Server {
    constructor() {
        this.router = new Router();
        this.presets = {};
    }
    use(middleware, config) {
        if (!this.server)
            this.createServer();
        if (!config)
            config = {};
        this.router.use(middleware, config);
    }
    useBuiltin(midd, ...args) {
        let middleware;
        const builtins = {
            "cors": cors,
            "rate limiter": rateLimit,
            "logger": logger,
            "security": securityHeaders,
            "cookies": cookieParser,
            "sessions": session,
            "env": envars
        };
        if (!(midd in builtins))
            return;
        let config = undefined;
        let opts = [];
        if (args[0] &&
            typeof args[0] === "object" &&
            !Array.isArray(args[0]) &&
            ("scope" in args[0] || Object.keys(args[0]).length === 0)) {
            config = args[0];
            opts = args.slice(1);
        }
        else {
            opts = args;
        }
        if (config && config.scope && config.scope[0] !== "/") {
            console.log(`${chalk.yellow("WARN:")} Scope paths should start with '/'.`);
        }
        middleware = builtins[midd](...opts);
        this.use(middleware, config);
    }
    createPreset(presetName, ...layers) {
        this.presets[presetName] = layers;
    }
    usePreset(presetName, config) {
        const layers = this.presets[presetName];
        if (!layers)
            return;
        layers.forEach(l => this.use(l, config));
    }
    viewEngine(engine, folder = 'views') {
        this.renderEngine = engine;
        this.renderFolder = gpath.resolve(folder);
    }
    get(path, ...handlers) {
        this.router.add("GET", path, ...handlers);
    }
    post(path, ...handlers) {
        this.router.add("POST", path, ...handlers);
    }
    put(path, ...handlers) {
        this.router.add("PUT", path, ...handlers);
    }
    patch(path, ...handlers) {
        this.router.add("PATCH", path, ...handlers);
    }
    delete(path, ...handlers) {
        this.router.add("DELETE", path, ...handlers);
    }
    notFound(handler) {
        if (!this.server)
            this.createServer();
        this.router.setNotFound(handler);
    }
    createServer() {
        const server = http.createServer((greq, gres) => {
            // Asserting Custom Request/Response Types
            let req = greq;
            let res = gres;
            // Custom res.send() function
            res.send = (data) => {
                if (typeof data === 'object') {
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(data));
                }
                else {
                    res.end(data);
                }
            };
            // Custom res.json() function
            res.json = (obj) => {
                if (typeof obj !== "object")
                    return;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(obj));
            };
            // Custom res.redirect() function
            res.redirect = (url, statusCode = 302) => {
                res.writeHead(statusCode, { Location: url });
                res.end();
            };
            // Custom res.status() function
            res.status = function (code) {
                this.statusCode = code;
                return this;
            };
            // Custom res.sendFile() function
            res.sendFile = (filePath) => {
                const absPath = gpath.resolve(filePath);
                if (!fs.existsSync(absPath)) {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end("File not found.");
                    return;
                }
                const contentType = mime.getType(absPath) || 'application/octet-stream';
                res.writeHead(200, { 'Content-Type': contentType });
                const fileStream = fs.createReadStream(absPath);
                fileStream.pipe(res);
            };
            // Custom res.render() function
            res.render = async (view, data = {}) => {
                if (!this.renderEngine)
                    throw new Error("View Engine is not set. Use app.viewEngine(engine <, folder>)");
                const filePath = gpath.join(this.renderFolder || "", `${view}.${this.renderEngine || "ejs"}`);
                if (this.renderEngine === 'ejs') {
                    const { renderEjs } = await import('../utils/render/handleEjs.js');
                    renderEjs(filePath, data, (err, html) => {
                        if (err) {
                            console.error("EJS Rendering Error:", err);
                            res.writeHead(500, { "Content-Type": "text/plain" });
                            return res.end("Error rendering view.");
                        }
                        res.writeHead(200, { "Content-Type": "text/html" });
                        res.end(html);
                    });
                }
            };
            // Custom req.get function
            req.get = function (headerName) {
                return this.headers[headerName.toLowerCase()] || null;
            };
            // Custom req.protocol function
            Object.defineProperty(req, "protocol", {
                get() {
                    return this.headers["x-forwarded-proto"] || (this.connection.encrypted ? "https" : "http");
                }
            });
            // Handling executing routes
            const method = req.method || "GET";
            const path = req.url ? req.url.split('?')[0] : "/";
            // Handling req.body manually
            let body = "";
            req.on("data", (chunk) => {
                body += chunk.toString();
            });
            req.on("end", async () => {
                if (body) {
                    let contentType = req.headers["content-type"];
                    if (contentType === "application/json") {
                        req.body = JSON.parse(body);
                    }
                    else if (contentType === "application/x-www-form-urlencoded") {
                        req.body = Object.fromEntries(new URLSearchParams(body));
                    }
                    else {
                        req.body = body;
                    }
                }
                else {
                    req.body = {};
                }
                await this.router.handle(method, path, req, res);
            });
        });
        this.server = server;
    }
    listen(port, callback = () => { }) {
        this.createServer();
        if (this.server) {
            this.server.listen(port, callback);
        }
        else {
            console.error("Server is not initialized.");
        }
    }
}
