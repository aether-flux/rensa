import { Request, Response } from "../types/httpTypes";

export function logger () {
  return (req: Request, res: Response, next: () => void) => {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.url} - ${res.statusCode} [${duration}ms]`);
    });

    next();
  }
}
