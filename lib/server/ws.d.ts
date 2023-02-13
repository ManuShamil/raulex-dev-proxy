import io from 'socket.io';
import { DevProxyServer } from '.';
import { ClientToServerEvents, ServerToClientEvents, IDevProxyServerSettings } from '../types';
export declare class WebSocketServer {
    private server;
    private credentials;
    webSocketServer: io.Server<ClientToServerEvents, ServerToClientEvents>;
    private expressApp;
    constructor(server: DevProxyServer, credentials: IDevProxyServerSettings);
    bindAuthentication(serverToken: string): void;
    bindEvents(): void;
}
