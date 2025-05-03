export function rateLimit(windowMs = 60000, maxRequests = 10) {
    const reqCounts = new Map();
    return (req, res, next) => {
        const ip = req.socket.remoteAddress;
        const now = Date.now();
        if (!reqCounts.has(ip)) {
            reqCounts.set(ip, { count: 1, startTime: now });
        }
        else {
            const entry = reqCounts.get(ip);
            if (now - entry.startTime < windowMs) {
                if (entry.count > maxRequests) {
                    res.statusCode = 429;
                    res.end("Too many requests, please try again later.");
                    return;
                }
                entry.count++;
            }
            else {
                reqCounts.set(ip, { count: 1, startTime: now });
            }
        }
        next();
    };
}
