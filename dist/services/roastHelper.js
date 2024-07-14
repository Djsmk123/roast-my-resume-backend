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
const remote_cofing_1 = __importDefault(require("../utils/remote_cofing"));
const prompt_builder_1 = __importDefault(require("../utils/prompt-builder"));
const constant_1 = require("../utils/constant");
const gemini_1 = __importDefault(require("../utils/gemini"));
const db_1 = __importDefault(require("../db/db"));
const glif_1 = require("./glif");
function roastHelper(roastRequest) {
    return __awaiter(this, void 0, void 0, function* () {
        const words = yield (0, remote_cofing_1.default)();
        const { roastTone, roleType, languageType, resumeText, hasMeme } = roastRequest;
        const prompt = (0, prompt_builder_1.default)(roastTone, roleType, words, languageType);
        //generate roast
        const content = [
            { role: "model", parts: [{ text: prompt }] },
            { role: "user", parts: [{ text: resumeText }] },
        ];
        const result = yield gemini_1.default.generateContent({
            contents: content,
            safetySettings: constant_1.constants.safetySettings,
        });
        const roastText = result.response.text();
        const env = process.env.NODE_ENV;
        console.log(env);
        let docId = "";
        let meme = null;
        if (hasMeme) {
            meme = yield (0, glif_1.generateMeme)(roastText, "clxtc53mi0000ghv10g6irjqj");
        }
        const data = {
            roastText: roastText,
            roastLevel: roastTone,
            createdAt: new Date(),
            role: roleType,
            language: languageType,
            meme: meme
        };
        const doc = yield db_1.default.resumeRoastCollectionV2.add(data);
        console.log("Document written with ID: ", doc.id);
        docId = doc.id;
        const snapshot = (yield db_1.default.resumeRoastCountCollection.get()).docs[0];
        const roastCount = snapshot.data()['count'] + 1;
        //update document
        yield db_1.default.resumeRoastCountCollection.doc(snapshot.id).update({
            'count': roastCount
        });
        if (meme) {
            return {
                roast: roastText,
                id: docId,
                meme: meme
            };
        }
        return {
            roast: roastText,
            id: docId,
            meme: null
        };
    });
}
exports.default = roastHelper;
//# sourceMappingURL=roastHelper.js.map