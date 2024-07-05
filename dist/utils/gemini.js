"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const configuration = new generative_ai_1.GoogleGenerativeAI(GEMINI_API_KEY);
const modelId = "gemini-1.5-flash-latest";
const model = configuration.getGenerativeModel({ model: modelId });
exports.default = model;
//# sourceMappingURL=gemini.js.map