import express from 'express';
import { WebSocketServer } from './ws';
import { IServiceResponse } from '../types';
export declare class ExpressApp {
    expressApp: express.Application;
    private responseStore;
    private webSocketServer;
    constructor();
    private bindGateway;
    respond(requestId: string, clientResponse: IServiceResponse): void;
    beforeResponseCleanup(responseObject: express.Response): void;
    bindWebSocketServerLate(webSocketServer: WebSocketServer): void;
    getNativeApp(): express.Application;
}
