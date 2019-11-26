import { ERROR_TYPE_INPUT, ERROR_TYPE_PARSE, SignPdfError } from '../SignPdfError';

const getSubstringIndex = (str: string | Buffer, substring: string, n: number) => {
    let times = 0;
    let index = null;

    while (times < n && index !== -1) {
        index = str.indexOf(substring, (index || 0) + 1);
        times++;
    }
    return index;
};

export interface Signature {
    ByteRange: Number[];
    signature: string; // of Buffer?
    signedData: Buffer;
}

/**
 * Basic implementation of signature extraction.
 *
 * Really basic. Would work in the simplest of cases where there is only one signature
 * in a document and ByteRange is only used once in it.
 *
 * @param {Buffer} pdf
 * @returns {Signature} {ByteRange: Number[], signature: Buffer, signedData: Buffer}
 */
export function extractSignature(pdf: Buffer, signatureCount = 1): Signature {
    if (!(pdf instanceof Buffer)) {
        throw new SignPdfError(
            'PDF expected as Buffer.',
            ERROR_TYPE_INPUT,
        );
    }

    // const byteRangePos = pdf.indexOf('/ByteRange [');
    const byteRangePos = getSubstringIndex(pdf, '/ByteRange [', signatureCount);
    if (!byteRangePos || byteRangePos === -1) {
        throw new SignPdfError(
            'Failed to locate ByteRange.',
            ERROR_TYPE_PARSE,
        );
    }

    const byteRangeEnd = pdf.indexOf(']', byteRangePos);
    if (!byteRangeEnd || byteRangeEnd === -1) {
        throw new SignPdfError(
            'Failed to locate the end of the ByteRange.',
            ERROR_TYPE_PARSE,
        );
    }

    const byteRange = pdf.slice(byteRangePos, byteRangeEnd + 1).toString();
    const matches = (/\/ByteRange \[(\d+) +(\d+) +(\d+) +(\d+) *\]/).exec(byteRange);
    if (matches === null) {
        throw new SignPdfError(
            'Failed to parse the ByteRange.',
            ERROR_TYPE_PARSE,
        );
    }

    const ByteRange = matches.slice(1).map(Number);
    const signedData = Buffer.concat([
        pdf.slice(ByteRange[0], ByteRange[0] + ByteRange[1]),
        pdf.slice(ByteRange[2], ByteRange[2] + ByteRange[3]),
    ]);

    const signatureHex = pdf.slice(ByteRange[0] + ByteRange[1] + 1, ByteRange[2])
        .toString('binary')
        .replace(/(?:00|>)+$/, '');

    const signature = Buffer.from(signatureHex, 'hex').toString('binary');

    return {
        ByteRange: matches.slice(1, 5).map(Number),
        signature,
        signedData,
    };
}
