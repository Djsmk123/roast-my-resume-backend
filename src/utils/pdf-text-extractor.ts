import PDFParser from 'pdf2json';


// Increase the limit to 20 listeners

async function parsePDF(buffer: Buffer): Promise<string> {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.setMaxListeners(1);
    return new Promise((resolve, reject) => {
        const onDataError = (errData: any) => {
            pdfParser.removeAllListeners("pdfParser_dataError");
            reject(errData.parserError);
        };

        const onDataReady = (pdfData: any) => {
            pdfParser.removeAllListeners("pdfParser_dataReady");
            resolve(pdfParser.getRawTextContent());
        };

        pdfParser.on("pdfParser_dataError", onDataError);
        pdfParser.on("pdfParser_dataReady", onDataReady);
        pdfParser.parseBuffer(buffer);
    });
}

export default parsePDF;
