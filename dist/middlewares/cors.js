export function cors(options = {}) {
    const { origin = "*", methods = "GET, POST, PUT, PATCH, DELETE, OPTIONS", headers = "Content-Type, Authorization" } = options;
    return (req, res, next) => {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Methods", methods);
        res.setHeader("Access-Control-Allow-Headers", headers);
        if (req.method === "OPTIONS") {
            res.writeHead(204);
            res.end();
            return;
        }
        next();
    };
}
