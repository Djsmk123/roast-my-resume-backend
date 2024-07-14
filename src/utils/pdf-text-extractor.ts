import PDFParser from 'pdf2json';
import fs from 'fs';
import https from 'https';

interface PDFParserInput {
    buffer: Buffer | null;
    url: string | null;
}

async function parsePDF(pdfParse: PDFParserInput): Promise<string> {
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

        if (pdfParse.url) {
            const url = pdfParse.url;
            const tempFilePath = "temp.pdf";

            // Download the PDF file
            const fileStream = fs.createWriteStream(tempFilePath);
            https.get(url, (response: any) => {
                response.pipe(fileStream);
                response.on("end", () => {
                    fileStream.close();

                    // Read the file into a buffer
                    fs.readFile(tempFilePath, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            const buffer = Buffer.from(data);
                            pdfParser.parseBuffer(buffer);

                            // Delete the temporary file after parsing
                            fs.unlink(tempFilePath, (err) => {
                                if (err) console.error(`Failed to delete temp file: ${err.message}`);
                            });
                        }
                    });
                });
            }).on('error', (err) => {
                fs.unlink(tempFilePath, () => { }); // Delete the file if an error occurs
                reject(err);
            });

        } else if (pdfParse.buffer) {
            pdfParser.parseBuffer(pdfParse.buffer);
        }
    });
}

export default parsePDF;
