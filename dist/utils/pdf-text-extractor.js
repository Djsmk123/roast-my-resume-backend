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
const pdf2json_1 = __importDefault(require("pdf2json"));
const pdfParser = new pdf2json_1.default(this, 1);
pdfParser.setMaxListeners(20); // Increase the limit to 20 listeners
function parsePDF(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const onDataError = (errData) => {
                pdfParser.removeAllListeners("pdfParser_dataError");
                reject(errData.parserError);
            };
            const onDataReady = (pdfData) => {
                pdfParser.removeAllListeners("pdfParser_dataReady");
                resolve(pdfParser.getRawTextContent());
            };
            pdfParser.on("pdfParser_dataError", onDataError);
            pdfParser.on("pdfParser_dataReady", onDataReady);
            pdfParser.parseBuffer(buffer);
        });
    });
}
exports.default = parsePDF;
//# sourceMappingURL=pdf-text-extractor.js.map