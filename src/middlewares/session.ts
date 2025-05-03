import { Request, Response } from "../types/httpTypes.js";
import { unique_id } from "../utils/uid.js";

export function session (timeout: number = 3600000) {
  const sessions = new Map();

  return (req: Request, res: Response, next: () => void) => {
    let sessionId = req.cookies?.sessionId;

    if (!sessionId || !sessions.has(sessionId)) {
      sessionId = unique_id();
      sessions.set(sessionId, {data: {}, expires: Date.now() + timeout});
      res.setHeader("Set-Cookie", `session_id=${sessionId}; Path=/; HttpOnly`);
    };

    req.session = sessions.get(sessionId).data;

    res.on("finish", () => {
      if (Date.now() > sessions.get(sessionId).expires) {
        sessions.delete(sessionId);
      }
    });

    next();
  }
}
