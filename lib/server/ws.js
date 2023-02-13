"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const socket_io_1 = __importDefault(require("socket.io"));
class WebSocketServer {
    constructor(server, credentials) {
        this.server = server;
        this.credentials = credentials;
        this.webSocketServer = new socket_io_1.default.Server(this.server.httpServer, { cors: {
                origin: '*',
                methods: ["GET", "POST"]
            }
        });
        this.expressApp = server.expressApp;
        this.bindAuthentication(this.credentials.token);
        this.bindEvents();
    }
    bindAuthentication(serverToken) {
        this.webSocketServer.use(function (socket, next) {
            const clientToken = socket.handshake.auth.token;
            if (clientToken != serverToken)
                next(new Error(`Invalid token provided.`));
            else
                next();
        });
    }
    bindEvents() {
        this.webSocketServer.on(`connection`, socket => {
            console.log(`CLIENT CONNECTED.`);
            socket.on('onResponseFromService', response => this.expressApp.respond(response.requestId, response));
        });
    }
}
exports.WebSocketServer = WebSocketServer;
