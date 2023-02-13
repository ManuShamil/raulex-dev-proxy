import { DevProxyClient } from '.';
export declare class DevProxyClientBuilder {
    private url;
    private forwardTo;
    private token;
    constructor(url: string);
    withCredentials(token?: string): DevProxyClientBuilder;
    withServiceEndpoint(url: string): DevProxyClientBuilder;
    build(): DevProxyClient;
}
