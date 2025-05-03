export declare class RouteStore {
    private root;
    private routeMap;
    constructor();
    insert(path: string): void;
    search(path: string): {
        params: {
            [key: string]: string;
        };
        url: string;
    } | null;
}
