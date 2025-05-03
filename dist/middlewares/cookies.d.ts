import { Request, Response } from "../types/httpTypes";
export declare function cookieParser(): (req: Request, res: Response, next: () => void) => void;
