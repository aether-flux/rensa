import { loadEnv } from "./middlewares/envars.js";
import { Server } from "./server/Server.js";
export class Rensa {
    constructor() {
        this.app = new Server();
        this.createServer = this.app.createServer;
        //     this.app.createServer();
        //     this.server = this.app.server;
    }
    use(middleware, config) {
        this.app.use(middleware, config);
    }
    useBuiltin(midd, ...opts) {
        this.app.useBuiltin(midd, ...opts);
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
}
export function env() {
    loadEnv();
}
