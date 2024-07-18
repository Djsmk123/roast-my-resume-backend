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
const dotenv_1 = __importDefault(require("dotenv"));
const network_response_model_1 = require("../models/network_response_model");
const linkedIn_request_model_1 = __importDefault(require("../models/linkedIn_request_model"));
const constant_1 = require("../utils/constant");
const roastHelper_1 = __importDefault(require("./roastHelper"));
const roastHelper_2 = __importDefault(require("./roastHelper"));
dotenv_1.default.config();
function roastLinkedIn(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield req.body;
            console.log(body);
            //validate request
            const linkedInRequest = linkedIn_request_model_1.default.parse(body);
            //check if the request is valid
            if (!linkedInRequest) {
                return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(400, "Invalid request"));
            }
            const roastLevel = parseInt(linkedInRequest.roastLevel); //index of roast level
            const role = parseInt(linkedInRequest.role);
            const language = parseInt(linkedInRequest.language);
            const roastTone = Object.values(constant_1.constants.Tones)[roastLevel];
            const roleType = Object.values(constant_1.constants.Roles)[role];
            const languageType = Object.values(constant_1.constants.Languages)[language];
            const linkedInProfile = linkedInRequest.linkedProfile;
            const linkedInProfileData = yield roastHelper_2.default.getLinkedInProfile(linkedInProfile);
            if (!linkedInProfileData) {
                return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(400, "Invalid LinkedIn profile"));
            }
            const resonse = yield roastHelper_1.default.roastHelper({
                roastTone,
                roleType,
                languageType,
                text: "Profile: " + JSON.stringify(linkedInProfileData),
                hasMeme: linkedInRequest.meme == "true",
                entity: "My Linked Profile",
            });
            if (!resonse) {
                return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(500, "Internal server error"));
            }
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(200, "Roast generated", resonse));
        }
        catch (e) {
            console.log(e);
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(500, "Internal server error"));
        }
    });
}
exports.default = roastLinkedIn;
//# sourceMappingURL=roastLinkedIn.js.map