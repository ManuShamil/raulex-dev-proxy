"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevProxyServerBuilder = exports.DevProxyServer = void 0;
const http_1 = __importDefault(require("http"));
const express_1 = require("./express");
const ws_1 = require("./ws");
class DevProxyServer {
    constructor(serverSettings) {
        this.serverSettings = serverSettings;
        this.expressApp = new express_1.ExpressApp();
        this.httpServer = http_1.default.createServer(this.expressApp.getNativeApp());
        this.webSocketServer = new ws_1.WebSocketServer(this, serverSettings);
        this.expressApp.bindWebSocketServerLate(this.webSocketServer);
    }
    deploy(port) {
        this.httpServer.listen(port, () => console.log(`DevProxyServer running on PORT ${port}`));
    }
}
exports.DevProxyServer = DevProxyServer;
class DevProxyServerBuilder {
    constructor() {
        this.token = '';
    }
    withToken(token) {
        this.token = token;
        return this;
    }
    build() {
        let iOptions = {
            token: this.token
        };
        return new DevProxyServer(iOptions);
    }
}
exports.DevProxyServerBuilder = DevProxyServerBuilder;
