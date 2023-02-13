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
const express_1 = __importDefault(require("express"));
const deployServer = () => {
    const server = (0, express_1.default)()
        .use(express_1.default.json())
        .use((req, res, next) => {
        let body = req.body;
        res.json(body).end();
    })
        .listen(0, () => {
    });
    return server;
};
describe(`Express Server`, () => {
    it('is deployable', () => {
        let server = deployServer();
        let address = server.address();
        console.log(address.port);
        server.close(() => {
            console.log('server closed');
        });
        expect(server).toBeTruthy();
    });
    it('can be connected to', () => __awaiter(void 0, void 0, void 0, function* () {
        let server = deployServer();
        let address = server.address();
        let uri = `http://localhost:${address.port}`;
        let data = {
            msg: `Hello`
        };
        let wrongData = {
            msg: `NotHello`
        };
        let rawResponse = yield fetch(uri, {
            method: `POST`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const response = yield rawResponse.json();
        expect(JSON.stringify(data)).toBe(JSON.stringify(response));
        expect(JSON.stringify(wrongData)).not.toBe(JSON.stringify(response));
        server.close(() => {
            console.log('server closed');
        });
    }));
});
