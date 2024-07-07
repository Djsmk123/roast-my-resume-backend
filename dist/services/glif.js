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
exports.getFeaturedMemes = getFeaturedMemes;
exports.generateMeme = generateMeme;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const apiKey = process.env.GLIF_API_KEY;
function getFeaturedMemes() {
    return __awaiter(this, void 0, void 0, function* () {
        const baseURL = "https://glif.app/api";
        const query = {
            featured: '1'
        };
        const endpoint = "/glifs";
        const response = yield fetch(`${baseURL}${endpoint}?${new URLSearchParams(query)}`);
        //parse to meme object
        if (!response.ok) {
            throw new Error("Error fetching memes");
        }
        const data = yield response.json();
        const memes = data.map((meme) => {
            const count = {
                likes: meme._count.likes,
                comments: meme._count.comments
            };
            return {
                id: meme.id,
                name: meme.name,
                imageUrl: meme.imageUrl,
                description: meme.description,
                createdAt: meme.createdAt,
                updatedAt: meme.updatedAt,
                publishedAt: meme.publishedAt,
                output: meme.output,
                outputType: meme.outputType,
                forkedFromId: meme.forkedFromId,
                featuredAt: meme.featuredAt,
                userId: meme.userId,
                completedSpellRunCount: meme.completedSpellRunCount,
                averageDuration: meme.averageDuration,
                _count: count
            };
        });
        const topMemes = memes.sort((a, b) => b._count.likes - a._count.likes).slice(0, 5);
        const randomIndex = Math.floor(Math.random() * topMemes.length);
        return topMemes[randomIndex];
    });
}
function generateMeme(resumeRoastText, memeId) {
    return __awaiter(this, void 0, void 0, function* () {
        const baseUrl = "https://simple-api.glif.app/" + memeId;
        const headers = {
            'Authorization': apiKey,
            'Content-Type': 'application/json'
        };
        const body = {
            input1: "if given text provide user real name,please use it as title of meme,Resume Roast Text: " + resumeRoastText,
        };
        const response = yield fetch(baseUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            throw new Error("Error generating meme");
        }
        const data = yield response.json();
        const memeData = {
            id: data.id,
            inputs: data.inputs,
            output: data.output,
            outputFull: data.outputFull
        };
        return memeData;
    });
}
//# sourceMappingURL=glif.js.map