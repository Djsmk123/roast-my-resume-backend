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
const glif_1 = require("./glif");
dotenv_1.default.config();
function generateRoast(request, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const body = yield request.body;
            console.log(body);
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
            // const roastText = "## Roasting Md. Mobin:\n\n* **\"Md. Mobin, the coding machine!**  He’s got more frameworks and libraries in his resume than a McDonald’s menu.  But hey, at least he knows how to use Google Docs, right?  The spacing is perfect, gotta give him that!\"\n* **\"9.348 GPA?**  More like 9.348 projects started and never finished.  Maybe next time, focus on quality over quantity, eh Mobin?\" \n* **\"Flutter, React, Node.js, Golang...**   The man's got more languages than a UN conference. But how many of them does he actually *speak* fluently? Just kidding, Mobin, we all know you’re fluent in the language of procrastination.\" \n* **\"You've got a \"Personal Portfolio\" but your \"Portfolio Website\" is a Vercel app. **  Bro, you’re like the guy who says he’s a \"fashionista\" but wears the same t-shirt every day.  Just saying…\"\n* **\"From 'Livve Safe App' to 'AskMe Backend Service,'** you’ve got a knack for coming up with catchy names.  But have you ever thought about focusing on actually *finishing* something?\" \n* **\"Don’t forget, Mobin, you're only a ‘Mobile Application Lead’ in Google Developer Student Clubs. **  And that’s just what it sounds like: a student.  Keep up the learning, but remember that a student’s job is to learn, not to lead.\" \n* **\"2.5k+ followers and 35k+ reads on dev.to blogs.  **  You're clearly a master of the internet. Now if only you could master the art of actually delivering on your promises.\" \n* **\"You’ve got more achievements than an Olympic athlete, Mobin. ** But are any of them actually *achievements*?  Or are they just a bunch of unfinished projects and a whole lot of hot air?\" \n* **\"Remember, Mobin, the only thing worse than being called a ‘coder’ is being called a ‘wannabe coder.’**  Keep working hard, stay humble, and maybe one day you’ll be more than just a line on a resume.\" \n";
            const roastText = result.response.text();
            const env = process.env.NODE_ENV;
            console.log(env);
            let docId = "";
            let meme = null;
            if (roastRequest.meme === "true") {
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
                return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(200, "Roast generated successfully", {
                    roast: roastText,
                    meme: meme,
                    id: docId
                }));
            }
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(200, "Roast generated successfully", { roast: roastText, id: docId }));
        }
        catch (e) {
            console.log(e);
            return (0, network_response_model_1.sendAPIResponse)(res, (0, network_response_model_1.createAPIResponse)(500, "Internal server error"));
        }
    });
}
//# sourceMappingURL=roastService.js.map