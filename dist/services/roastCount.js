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
exports.getRoastCount = getRoastCount;
const db_1 = __importDefault(require("../db/db"));
const network_response_model_1 = require("../models/network_response_model");
function getRoastCount(request, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const snapshot = (yield db_1.default.resumeRoastCountCollection.get()).docs[0];
            const roastCount = snapshot.data()['count'];
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(200, roastCount.toString()));
        }
        catch (e) {
            console.error(e);
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(500, e.message));
        }
    });
}
//# sourceMappingURL=roastCount.js.map