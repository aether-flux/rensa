import { IncomingMessage, ServerResponse } from "http";

// Request type
// export interface Request<Path extends string = string> extends IncomingMessage {
export interface Request extends IncomingMessage {
  body?: any;
  // params?: ParamsObject<Path>;
  params?: any;
  get?: (headerName: string) => string | string[] | null;
  protocol?: string;
  cookies: Record<string, string>;
  session: Record<string, any>;
};

// Response type
export interface Response extends ServerResponse {
  send: (data: any) => void;
  json: (obj: Object) => void;
  redirect: (url: string, statusCode?: number) => void;
  status: (code: number) => Response;
  sendFile: (path: string) => void;
  render: (view: string, data?: Record<string, any>) => void;
}

// Request params type
type ExtractParams<Path extends string> = 
  Path extends `${string}:${infer Param}/${infer Rest}`
  ? Param | ExtractParams<`/${Rest}`>
  : Path extends `${string}:${infer Param}`
  ? Param
  : never;

export type ParamsObject<Path extends string> = {
  [K in ExtractParams<Path>]: string;
};

// export type ReqWithParams<Path extends string> = Request<ParamsObject<Path>>;
