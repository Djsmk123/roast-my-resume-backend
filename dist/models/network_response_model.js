"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAPIResponse = createAPIResponse;
exports.sendAPIResponse = sendAPIResponse;
function createAPIResponse(code, message) {
    return { code, message };
}
function sendAPIResponse(res, response) {
    res.status(response.code).json({
        message: response.message,
        code: response.code,
    });
}
//# sourceMappingURL=network_response_model.js.map