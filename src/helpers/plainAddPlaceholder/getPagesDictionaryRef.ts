import { ERROR_TYPE_PARSE, SignPdfError } from '../../SignPdfError';

/**
 * @param {Object} info As extracted from readRef()
 */

export function getPagesDictionaryRef(info: { root: string }) {
    const pagesRefRegex = new RegExp('\\/Type\\s*\\/Catalog\\s*\\/Pages\\s+(\\d+\\s\\d+\\sR)', 'g');
    const match = pagesRefRegex.exec(info.root);
    if (match === null) {
        throw new SignPdfError(
            'Failed to find the pages descriptor. This is probably a problem in node-signpdf.',
            ERROR_TYPE_PARSE,
        );
    }

    return match[1];
}
