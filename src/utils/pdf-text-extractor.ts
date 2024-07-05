import PDFParser from 'pdf2json';

const pdfParser = new PDFParser(this, true);

async function parsePDF(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfParser.getRawTextContent()));
        pdfParser.parseBuffer(buffer);
    });
}
export default parsePDF;