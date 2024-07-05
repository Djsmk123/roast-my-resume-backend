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
        //count the number of documents in the collection
        //check if development or production
        if (process.env.NODE_ENV === 'development') {
            console.log("Development mode");
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(200, '0'));
        }
        const snapshot = yield db_1.default.resumeRoastCollection.get();
        const roastCount = snapshot.size + 800; //initial count of 500 roast,you can change it to 0 if you want to start from 0;
        return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(200, roastCount.toString()));
    });
}
//# sourceMappingURL=roastCount.js.map