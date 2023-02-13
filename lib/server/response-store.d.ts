import express from 'express';
import { ExpressApp } from './express';
interface ResponseValue {
    requestId: string;
    responseObject: express.Response;
    createdAt: number;
    expiresAt: number;
}
export default class ResponseStore {
    private expressApp;
    private clearanceTimeMs;
    private static CLEANUP_MS;
    private responseMap;
    constructor(expressApp: ExpressApp, clearanceTimeMs: number);
    setResponse(requestId: string, responseObject: express.Response): void;
    getResponse(requestId: string): ResponseValue | undefined;
    deleteEntry(requestId: string, cleanup?: boolean): void;
    private cleanUp;
}
export {};
