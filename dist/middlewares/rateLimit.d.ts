import { Request, Response } from "../types/httpTypes";
export declare function rateLimit(windowMs?: number, maxRequests?: number): (req: Request, res: Response, next: () => void) => void;
