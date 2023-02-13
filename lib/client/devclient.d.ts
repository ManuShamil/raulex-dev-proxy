import { Socket } from 'socket.io-client';
import { IDevProxyClientCredentials } from '.';
import { ServerToClientEvents, ClientToServerEvents, IServiceResponse, IForwardedRequest } from '../types';
export declare class DevProxyClient {
    private credentials;
    socketClient: Socket<ServerToClientEvents, ClientToServerEvents>;
    serviceEndpoint: URL | '';
    constructor(credentials: IDevProxyClientCredentials);
    bindSocketEvents(): void;
    private getRequestLog;
    forwardToService(forwardedRequest: IForwardedRequest): Promise<IServiceResponse>;
}
