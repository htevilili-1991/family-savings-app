declare module 'ziggy-js' {
    interface Ziggy {
        namedRoutes: { [key: string]: any };
        baseUrl: string;
        baseProtocol: string;
        baseDomain: string;
        basePort: number | false;
    }
}