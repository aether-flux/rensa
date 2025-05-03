import { Request, Response } from "../types/httpTypes";

export function rateLimit (windowMs: number = 60000, maxRequests: number = 10) {
  const reqCounts = new Map();

  return (req: Request, res: Response, next: () => void) => {
    const ip = req.socket.remoteAddress;
    const now = Date.now();

    if (!reqCounts.has(ip)) {
      reqCounts.set(ip, {count: 1, startTime: now});
    } else {
      const entry = reqCounts.get(ip);

      if (now - entry.startTime < windowMs) {
        if (entry.count > maxRequests) {
          res.statusCode = 429;
          res.end("Too many requests, please try again later.");
          return;
        }
        entry.count++;
      } else {
        reqCounts.set(ip, {count: 1, startTime: now});
      }
    }

    next();
  }
}
