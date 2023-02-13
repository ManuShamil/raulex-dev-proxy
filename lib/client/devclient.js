"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevProxyClient = void 0;
const socket_io_client_1 = require("socket.io-client");
const axios_1 = __importDefault(require("axios"));
const cli_color_1 = __importDefault(require("cli-color"));
class DevProxyClient {
    constructor(credentials) {
        this.credentials = credentials;
        let auth = {
            token: credentials.token
        };
        this.socketClient = (0, socket_io_client_1.io)(this.credentials.url.toString(), { auth });
        this.serviceEndpoint = this.credentials.forwardTo;
        this.bindSocketEvents();
    }
    bindSocketEvents() {
        this.socketClient.on('onRequest', (forwardedRequest) => __awaiter(this, void 0, void 0, function* () {
            //console.log(`REQUEST ID: ${ forwardedRequest.requestId } RECEIVED.`)
            let response = yield this.forwardToService(forwardedRequest);
            this.socketClient.emit('onResponseFromService', response);
        }));
    }
    getRequestLog(status, route, forwardedTo, requestId) {
        let statusText = status % 500 < 100 || status % 400 < 100
            ? cli_color_1.default.redBright(status) :
            cli_color_1.default.greenBright(status);
        let routeText = cli_color_1.default.cyanBright(route);
        let forwardedToText = cli_color_1.default.blackBright(`${forwardedTo}`);
        let requestIdText = cli_color_1.default.yellow(`(${requestId})`);
        return `${statusText} ${routeText} -> ${forwardedToText} ${requestIdText}`;
    }
    forwardToService(forwardedRequest) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let uri = new URL(forwardedRequest.route, this.serviceEndpoint.toString()).href;
            try {
                let response = yield axios_1.default.request({
                    url: uri,
                    method: forwardedRequest.method,
                    data: forwardedRequest.body
                });
                let { data, status } = response;
                console.log(this.getRequestLog(status, forwardedRequest.route, uri, forwardedRequest.requestId));
                let rawResponse = {
                    requestId: forwardedRequest.requestId,
                    status: status,
                    body: data
                };
                resolve(rawResponse);
            }
            catch (err) {
                console.log(this.getRequestLog(500, forwardedRequest.route, uri, forwardedRequest.requestId));
                let errResponse = {
                    requestId: forwardedRequest.requestId,
                    status: 500,
                    body: {
                        status: 500,
                        msg: `Service Endpoint is not available.`
                    }
                };
                resolve(errResponse);
            }
        }));
    }
}
exports.DevProxyClient = DevProxyClient;
