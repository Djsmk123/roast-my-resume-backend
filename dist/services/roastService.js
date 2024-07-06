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
exports.default = generateRoast;
const roast_request_model_1 = __importDefault(require("../models/roast_request_model"));
const network_response_model_1 = require("../models/network_response_model");
const constant_1 = require("../utils/constant");
const remote_cofing_1 = __importDefault(require("../utils/remote_cofing"));
const prompt_builder_1 = __importDefault(require("../utils/prompt-builder"));
const pdf_text_extractor_1 = __importDefault(require("../utils/pdf-text-extractor"));
const gemini_1 = __importDefault(require("../utils/gemini"));
const db_1 = __importDefault(require("../db/db"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function generateRoast(request, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield request.body;
            const roastRequest = roast_request_model_1.default.parse(body);
            //check if roastRequest is valid
            if (!roastRequest) {
                return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(400, "Invalid request"));
            }
            let resumeFile;
            if (Array.isArray(request.files) && request.files.length > 0) {
                resumeFile = request.files[0].buffer;
            }
            if (!roastRequest.textBasedResume && !resumeFile) {
                return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(400, "No resume provided"));
            }
            const roastLevel = parseInt(roastRequest.roastLevel); //index of roast level
            const role = parseInt(roastRequest.role);
            const language = parseInt(roastRequest.language);
            const roastTone = Object.values(constant_1.constants.Tones)[roastLevel];
            const roleType = Object.values(constant_1.constants.Roles)[role];
            const languageType = Object.values(constant_1.constants.Languages)[language];
            const words = yield (0, remote_cofing_1.default)();
            const prompt = (0, prompt_builder_1.default)(roleType, roastTone, words, languageType);
            let resumeText = roastRequest.textBasedResume;
            if (resumeFile) {
                //parse pdf
                const pdfText = yield (0, pdf_text_extractor_1.default)(resumeFile);
                if (pdfText) {
                    resumeText = pdfText;
                }
                else {
                    return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(400, "Error parsing pdf"));
                }
            }
            //generate roast
            const content = [
                { role: "model", parts: [{ text: prompt }] },
                { role: "user", parts: [{ text: resumeText }] },
            ];
            const result = yield gemini_1.default.generateContent({
                contents: content,
                safetySettings: constant_1.constants.safetySettings,
            });
            const env = process.env.NODE_ENV;
            console.log(env);
            if (env !== "development") {
                try {
                    yield db_1.default.resumeRoastCollection.add({
                        roastText: result.response.text(),
                        roastLevel: roastTone,
                        createdAt: new Date(),
                        role: roleType,
                        language: languageType,
                    });
                    const snapshot = (yield db_1.default.resumeRoastCountCollection.get()).docs[0];
                    const roastCount = snapshot.data()['count'] + 1;
                    //update document
                    yield db_1.default.resumeRoastCountCollection.doc(snapshot.id).update({
                        'count': roastCount
                    });
                }
                catch (e) {
                    //ignore
                    console.log(e);
                }
            }
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(200, result.response.text()));
        }
        catch (e) {
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(500, "Internal server error"));
        }
    });
}
//# sourceMappingURL=roastService.js.map