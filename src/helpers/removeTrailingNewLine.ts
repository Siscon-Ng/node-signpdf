import { ERROR_TYPE_INPUT, ERROR_TYPE_PARSE, SignPdfError } from '../SignPdfError';

/**
 * Removes a trailing new line if there is such.
 *
 * Also makes sure the file ends with an EOF line as per spec.
 * @param {Buffer} pdf
 * @returns {Buffer}
 */
export function removeTrailingNewLine(pdf: Buffer): Buffer {
    if (!(pdf instanceof Buffer)) {
        throw new SignPdfError(
            'PDF expected as Buffer.',
            ERROR_TYPE_INPUT,
        );
    }

    const lastChar = pdf.slice(pdf.length - 1).toString();
    let output = pdf;
    if (lastChar === '\n') {
        // remove the trailing new line
        output = pdf.slice(0, pdf.length - 1);
    }

    const lastLine = output.slice(output.length - 6).toString();
    if (lastLine !== '\n%%EOF') {
        throw new SignPdfError(
            'A PDF file must end with an EOF line.',
            ERROR_TYPE_PARSE,
        );
    }

    return output;
}
