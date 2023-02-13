"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevProxyClientBuilder = void 0;
const _1 = require(".");
class DevProxyClientBuilder {
    constructor(url) {
        this.url = new URL(url);
        this.forwardTo = undefined;
        this.token = '';
    }
    withCredentials(token) {
        this.token = token || '';
        return this;
    }
    withServiceEndpoint(url) {
        this.forwardTo = new URL(url);
        return this;
    }
    build() {
        if (!this.forwardTo)
            throw new Error(`BUILD ERROR: serviceEndpoint not mentioned.`);
        let iOptions = {
            url: this.url,
            token: this.token,
            forwardTo: this.forwardTo
        };
        return new _1.DevProxyClient(iOptions);
    }
}
exports.DevProxyClientBuilder = DevProxyClientBuilder;
