declare module 'ziggy-js' {
    interface RouteParams {
        [key: string]: any;
    }

    type Route = (name?: string, params?: RouteParams, absolute?: boolean) => string;

    export const route: Route;
}
