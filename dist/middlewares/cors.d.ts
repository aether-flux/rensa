import { Request, Response } from "../types/httpTypes";
export declare function cors(options?: {
    [key: string]: string;
}): (req: Request, res: Response, next: () => void) => void;
