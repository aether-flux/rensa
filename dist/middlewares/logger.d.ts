import { Request, Response } from "../types/httpTypes";
export declare function logger(): (req: Request, res: Response, next: () => void) => void;
