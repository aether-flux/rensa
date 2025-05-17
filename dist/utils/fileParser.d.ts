export declare const fileParser: (files: string[], routes: string) => ({
    method: string;
    route: null;
    file: string;
} | {
    method: string;
    route: string;
    file: string;
})[];
