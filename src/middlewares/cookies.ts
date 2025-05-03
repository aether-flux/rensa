import { Request, Response } from "../types/httpTypes";

export function cookieParser () {
  return (req: Request, res: Response, next: () => void) => {
    const cookies = req.headers.cookie;
    req.cookies = {};

    if (cookies) {
      cookies.split(";").forEach((cookie) => {
        const [key, value] = cookie.trim().split("=");
        req.cookies[key ?? ""] = decodeURIComponent(value);
      });
    }

    next();
  }
}
