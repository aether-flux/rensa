import { Request, Response } from '../types/httpTypes';
export declare function loadEnv(): void;
export declare function envars(): (req: Request, res: Response, next: () => void) => void;
