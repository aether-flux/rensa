import { Request, Response } from "../types/httpTypes.js";
export declare function session(timeout?: number): (req: Request, res: Response, next: () => void) => void;
