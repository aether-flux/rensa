import { unique_id } from "../utils/uid.js";

export function session (timeout = 3600000) {
  const sessions = new Map();

  return (req, res, next) => {
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
