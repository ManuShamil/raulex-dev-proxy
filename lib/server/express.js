"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const uuid_1 = require("uuid");
const response_store_1 = __importDefault(require("./response-store"));
class ExpressApp {
    constructor() {
        this.expressApp = (0, express_1.default)();
        this.responseStore = new response_store_1.default(this, 5 * 60 * 1000);
        this.expressApp.use(express_1.default.json());
        this.expressApp.use((0, cors_1.default)({ credentials: true, origin: ['*'] }));
        this.expressApp.use((0, morgan_1.default)('dev'));
        this.bindGateway();
    }
    bindGateway() {
        this.expressApp.use((req, res, next) => {
            var _a;
            if (!this.webSocketServer)
                return;
            let connectedClientCount = (_a = this.webSocketServer) === null || _a === void 0 ? void 0 : _a.webSocketServer.sockets.sockets.size;
            if (connectedClientCount <= 0) {
                res.status(500)
                    .json({
                    status: 500,
                    data: {
                        msg: `No clients connected.`
                    }
                })
                    .end();
                return;
            }
            let method = req.method;
            let route = req.originalUrl;
            let requestId = (0, uuid_1.v4)();
            let toForward = {
                requestId,
                method,
                route,
                body: req.body
            };
            this.responseStore.setResponse(requestId, res);
            this.webSocketServer.webSocketServer.emit('onRequest', toForward);
        });
    }
    respond(requestId, clientResponse) {
        //console.log(`SERVING REQUEST: ${ requestId }`)
        let responseValue = this.responseStore.getResponse(requestId);
        let responseObject = responseValue === null || responseValue === void 0 ? void 0 : responseValue.responseObject;
        if (!responseObject)
            return;
        responseObject
            .status(clientResponse.status)
            .json(clientResponse.body);
    }
    beforeResponseCleanup(responseObject) {
        responseObject
            .status(500)
            .json({
            status: 500,
            data: {
                msg: `No response from client.`
            }
        });
    }
    bindWebSocketServerLate(webSocketServer) {
        this.webSocketServer = webSocketServer;
    }
    getNativeApp() {
        return this.expressApp;
    }
}
exports.ExpressApp = ExpressApp;
