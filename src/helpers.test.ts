import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';
import { pdfkitAddPlaceholder, extractSignature } from './helpers';
import { SignPdf } from './signpdf';
import { ERROR_TYPE_PARSE, SignPdfError } from './SignPdfError';

const signer = new SignPdf();

/**
 * Creates a Buffer containing a PDF.
 * Returns a Promise that is resolved with the resulting Buffer of the PDFDocument.
 * @returns {Promise<Buffer>}
 */
const createPdf = (placeholder: {}, text = 'node-signpdf') => new Promise<Buffer>((resolve) => {
    const pdf = new PDFDocument({
        autoFirstPage: true,
        size: 'A4',
        layout: 'portrait',
        bufferPages: true,
    });
    pdf.info.CreationDate = '' as any; // FIXME Date?

    // Add some content to the page
    pdf
        .fillColor('#333')
        .fontSize(25)
        .moveDown()
        .text(text);

    // Collect the ouput PDF
    // and, when done, resolve with it stored in a Buffer
    const pdfChunks: any[] = [];
    pdf.on('data', (data) => {
        pdfChunks.push(data);
    });
    pdf.on('end', () => {
        resolve(Buffer.concat(pdfChunks));
    });

    // Externally (to PDFKit) add the signature placeholder.
    const refs = pdfkitAddPlaceholder({
        pdf,
        pdfBuffer: Buffer.from([pdf] as any),
        reason: 'I am the author',
        ...placeholder,
    });
    // Externally end the streams of the created objects.
    // PDFKit doesn't know much about them, so it won't .end() them.
    Object.keys(refs).forEach(key => refs[key].end());

    // Also end the PDFDocument stream.
    // See pdf.on('end'... on how it is then converted to Buffer.
    pdf.end();
});

describe('Helpers', () => {
    it('extract signature from signed pdf', async () => {
        const pdfBuffer = await createPdf({
            placeholder: {
                signatureLength: 1612,
            },
        });
        const p12Buffer = fs.readFileSync(`${__dirname}/../resources/certificate.p12`);

        const signedPdfBuffer = signer.sign(pdfBuffer, p12Buffer);
        const originalSignature = signer.lastSignature;

        const {signature} = extractSignature(signedPdfBuffer);
        expect(Buffer.from(signature, 'binary').toString('hex')).toBe(originalSignature);
    });

    it('expects PDF to contain a ByteRange placeholder', () => {
        try {
            extractSignature(Buffer.from('No BR placeholder'));
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(ERROR_TYPE_PARSE);
        }
    });

    it('expects PDF to contain a byteRangeEnd', () => {
        try {
            extractSignature(Buffer.from('/ByteRange [   No End'));
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(ERROR_TYPE_PARSE);
        }
    });
});
