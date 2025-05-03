import { Request, Response } from "../types/httpTypes";
export declare function securityHeaders(): (req: Request, res: Response, next: () => void) => void;
