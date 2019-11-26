/*
PDFObject by Devon Govett used below.
The class is part of pdfkit. See https://github.com/foliojs/pdfkit
LICENSE: MIT. Included in this folder.
Modifications may have been applied for the purposes of node-signpdf.
*/

import PDFAbstractReference from './abstract_reference';
/*
PDFObject - converts JavaScript types into their corresponding PDF types.
By Devon Govett
*/

const pad = (str: any, length: number) => (Array(length + 1).join('0') + str).slice(-length);

const escapableRe = /[\n\r\t\b\f\(\)\\]/g;
const escapable: { [key: string]: string } = {
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\b': '\\b',
    '\f': '\\f',
    '\\': '\\\\',
    '(': '\\(',
    ')': '\\)',
};

// Convert little endian UTF-16 to big endian
const swapBytes = (buff: Buffer): Buffer => {
    const l = buff.length;
    if (l & 0x01) {
        throw new Error('Buffer length must be even');
    } else {
        for (let i = 0, end = l - 1; i < end; i += 2) {
            const a = buff[i];
            buff[i] = buff[i + 1];
            buff[i + 1] = a;
        }
    }

    return buff;
};

export default class PDFObject {
    public static convert(object: any, encryptFn?: any): any {
    // String literals are converted to the PDF name type
        if (typeof object === 'string') {
            return `/${object}`;

            // String objects are converted to PDF strings (UTF-16)
        } else if (object instanceof String) {
            let str = object;
            // Detect if this is a unicode string
            let isUnicode = false;
            for (let i = 0, end = str.length; i < end; i += 1) {
                if (str.charCodeAt(i) > 0x7f) {
                    isUnicode = true;
                    break;
                }
            }

            // If so, encode it as big endian UTF-16
            let stringBuffer;
            if (isUnicode) {
                stringBuffer = swapBytes(Buffer.from(`\ufeff${str}`, 'utf16le'));
            } else {
                stringBuffer = Buffer.from(str as string, 'ascii');
            }

            // Encrypt the string when necessary
            if (encryptFn) {
                str = encryptFn(stringBuffer).toString('binary');
            } else {
                str = stringBuffer.toString('binary');
            }

            // Escape characters as required by the spec
            str = str.replace(escapableRe, c => escapable[c] );

            return `(${str})`;

            // Buffers are converted to PDF hex strings
        } else if (Buffer.isBuffer(object)) {
            return `<${object.toString('hex')}>`;
        } else if (object instanceof PDFAbstractReference) {
            return object.toString();
        } else if (object instanceof Date) {
            // tslint:disable-next-line
            let str = `D:${pad(object.getUTCFullYear(), 4)}${pad(object.getUTCMonth() + 1, 2)}${pad(object.getUTCDate(), 2)}${pad(object.getUTCHours(), 2)}${pad(object.getUTCMinutes(), 2)}${pad(object.getUTCSeconds(), 2)}Z`;

            // Encrypt the string when necessary
            if (encryptFn) {
                str = encryptFn(Buffer.from(str, 'ascii')).toString('binary');

                // Escape characters as required by the spec
                str = str.replace(escapableRe, c => escapable[c]);
            }

            return `(${str})`;
        } else if (Array.isArray(object)) {
            const items = object.map(e => PDFObject.convert(e, encryptFn)).join(' ');
            return `[${items}]`;
        } else if ({}.toString.call(object) === '[object Object]') {
            const out = ['<<'];
            let streamData;

            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    let val = object[key];
                    let checkedValue = '';

                    if (val.toString().indexOf('<<') !== -1) {
                        checkedValue = val;
                    } else {
                        checkedValue = PDFObject.convert(val, encryptFn);
                    }

                    if (key === 'stream') {
                        streamData = `${key}\n${val}\nendstream`;
                    } else {
                        out.push(`/${key} ${checkedValue}`);
                    }
                }
            }
            out.push('>>');

            if (streamData) {
                out.push(streamData);
            }
            return out.join('\n');
        } else if (typeof object === 'number') {
            return PDFObject.number(object);
        }
        return `${object}`;
    }

    public static number(n: number) {
        if (n > -1e21 && n < 1e21) {
            return Math.round(n * 1e6) / 1e6;
        }

        throw new Error(`unsupported number: ${n}`);
    }
}
