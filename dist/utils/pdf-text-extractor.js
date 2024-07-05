"use strict";
// import PDFParser from 'pdf2json';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// const pdfParser = new PDFParser(this, true);
function parsePDF(buffer) {
    return __awaiter(this, void 0, void 0, function* () {
        return "Hello World!";
        // return new Promise((resolve, reject) => {
        //     pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        //     pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfParser.getRawTextContent()));
        //     pdfParser.parseBuffer(buffer);
        // });
    });
}
exports.default = parsePDF;
//# sourceMappingURL=pdf-text-extractor.js.map