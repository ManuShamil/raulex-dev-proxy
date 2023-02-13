export interface IDevProxyClientCredentials {
    url: URL;
    token: string;
    forwardTo: URL;
}
export * from './builder';
export * from './devclient';
