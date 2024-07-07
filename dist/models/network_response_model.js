"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPIResponse = createAPIResponse;
exports.sendAPIResponse = sendAPIResponse;
function createAPIResponse(code, message, data) {
    return { code, message, data };
}
function sendAPIResponse(res, response) {
    const { code, message, data } = response;
    if (data) {
        return res.status(code).json({ message, data, code });
    }
    res.status(code).json({ message, code });
}
//# sourceMappingURL=network_response_model.js.map