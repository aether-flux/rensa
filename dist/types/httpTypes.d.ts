import { IncomingMessage, ServerResponse } from "http";
export interface Request extends IncomingMessage {
    body?: any;
    params?: any;
    get?: (headerName: string) => string | string[] | null;
    protocol?: string;
    cookies: Record<string, string>;
    session: Record<string, any>;
}
export interface Response extends ServerResponse {
    send: (data: any) => void;
    json: (obj: Object) => void;
    redirect: (url: string, statusCode?: number) => void;
    status: (code: number) => Response;
    sendFile: (path: string) => void;
    render: (view: string, data?: Record<string, any>) => void;
}
