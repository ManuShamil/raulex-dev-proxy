/// <reference types="node" />
import http from 'http';
import { ExpressApp } from './express';
import { WebSocketServer } from './ws';
import { IDevProxyServerSettings } from '../types';
export declare class DevProxyServer {
    private serverSettings;
    httpServer: http.Server;
    expressApp: ExpressApp;
    webSocketServer: WebSocketServer;
    constructor(serverSettings: IDevProxyServerSettings);
    deploy(port: number): void;
}
export declare class DevProxyServerBuilder {
    private token;
    constructor();
    withToken(token: string): this;
    build(): DevProxyServer;
}
