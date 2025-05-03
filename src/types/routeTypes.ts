import { Request, Response } from "./httpTypes";

export type Middleware = (req: Request, res: Response, next: () => void) => void | Promise<void>;

export type RouteData = {
  middlewares: Middleware[];
  handler: (req: Request, res: Response) => void | Promise<void>;
};

export type Handler = (req: Request, res: Response) => void;

export type RouteNode = {
  children: { [key: string]: RouteNode };
  eor: boolean;
}

export type RouteMap = { [key: string]: RouteNode };

