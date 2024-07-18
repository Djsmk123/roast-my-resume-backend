"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const linkedInRequestSchema = zod_1.default.object({
    roastLevel: zod_1.default.string().min(0).max(3).default('3'),
    role: zod_1.default.string().optional().default('0'),
    language: zod_1.default.string().optional().default('2'),
    meme: zod_1.default.string().optional().default("false"),
    linkedProfile: zod_1.default.string(),
});
exports.default = linkedInRequestSchema;
//# sourceMappingURL=linkedIn_request_model.js.map