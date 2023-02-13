"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseStore {
    constructor(expressApp, clearanceTimeMs) {
        this.expressApp = expressApp;
        this.clearanceTimeMs = clearanceTimeMs;
        this.responseMap = new Map();
        //! run cleanup every CLEANUP_MS
        setInterval(this.cleanUp.bind(this), ResponseStore.CLEANUP_MS);
    }
    setResponse(requestId, responseObject) {
        let timeNow = Date.now();
        let value = {
            requestId,
            responseObject,
            createdAt: timeNow,
            expiresAt: timeNow + this.clearanceTimeMs
        };
        this.responseMap.set(requestId, value);
    }
    getResponse(requestId) {
        return this.responseMap.get(requestId);
    }
    deleteEntry(requestId, cleanup) {
        var _a;
        let responseObject = (_a = this.responseMap.get(requestId)) === null || _a === void 0 ? void 0 : _a.responseObject;
        if (cleanup && responseObject)
            this.expressApp.beforeResponseCleanup(responseObject);
        this.responseMap.delete(requestId);
    }
    cleanUp() {
        console.log(`CLEANUP RUNNING`);
        let timeNow = Date.now();
        let deleteQueue = new Array();
        this.responseMap.forEach((val, requestId) => { if (timeNow > val.expiresAt)
            deleteQueue.push(requestId); });
        deleteQueue.forEach(requestId => {
            var _a;
            let responseObject = (_a = this.responseMap.get(requestId)) === null || _a === void 0 ? void 0 : _a.responseObject;
            if (responseObject)
                this.expressApp.beforeResponseCleanup(responseObject);
            this.responseMap.delete(requestId);
        });
        console.log(`CLEANED UP ${deleteQueue.length} IDLE RESPONSES`);
    }
}
exports.default = ResponseStore;
ResponseStore.CLEANUP_MS = 5 * 60 * 1000;
