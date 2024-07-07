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
const body_parser_1 = __importDefault(require("body-parser"));
const routes_1 = require("./api/routes");
const roastCount_1 = require("./services/roastCount");
const dotenv_1 = __importDefault(require("dotenv"));
const roastService_1 = __importDefault(require("./services/roastService"));
const multer_1 = __importDefault(require("multer"));
const cors_1 = __importDefault(require("cors"));
const glif_1 = require("./services/glif");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const upload = (0, multer_1.default)();
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Rate limiter middleware
const apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 10,
    message: "Too many requests from this IP, please try again after 15 minutes",
    standardHeaders: true,
    legacyHeaders: false,
});
// Apply the rate limiting middleware to all requests
app.use(apiLimiter);
app.get('/', (_req, res) => {
    //health check
    res.status(200).send("Server is running");
});
app.get(`/${routes_1.routes.roastCount}`, roastCount_1.getRoastCount);
app.post(`/${routes_1.routes.roast}`, upload.any(), roastService_1.default);
app.get('/glif', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, glif_1.getFeaturedMemes)();
        res.status(200).send(data);
    }
    catch (e) {
        res.status(500).send(e);
    }
}));
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map