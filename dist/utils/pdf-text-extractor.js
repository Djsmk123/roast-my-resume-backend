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
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https"));
function parsePDF(pdfParse) {
    return __awaiter(this, void 0, void 0, function* () {
        const pdfParser = new pdf2json_1.default(this, 1);
        pdfParser.setMaxListeners(1);
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
            if (pdfParse.url) {
                const url = pdfParse.url;
                const tempFilePath = "temp.pdf";
                // Download the PDF file
                const fileStream = fs_1.default.createWriteStream(tempFilePath);
                https_1.default.get(url, (response) => {
                    response.pipe(fileStream);
                    response.on("end", () => {
                        fileStream.close();
                        // Read the file into a buffer
                        fs_1.default.readFile(tempFilePath, (err, data) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                const buffer = Buffer.from(data);
                                pdfParser.parseBuffer(buffer);
                                // Delete the temporary file after parsing
                                fs_1.default.unlink(tempFilePath, (err) => {
                                    if (err)
                                        console.error(`Failed to delete temp file: ${err.message}`);
                                });
                            }
                        });
                    });
                }).on('error', (err) => {
                    fs_1.default.unlink(tempFilePath, () => { }); // Delete the file if an error occurs
                    reject(err);
                });
            }
            else if (pdfParse.buffer) {
                pdfParser.parseBuffer(pdfParse.buffer);
            }
        });
    });
}
exports.default = parsePDF;
//# sourceMappingURL=pdf-text-extractor.js.map