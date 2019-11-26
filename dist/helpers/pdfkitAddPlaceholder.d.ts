/// <reference types="node" />
export interface PDFKitAddPlaceholderOpts {
    pdf: any;
    pdfBuffer: Buffer;
    reason?: string;
    signatureLength?: number;
    byteRangePlaceholder?: string;
}
/**
 * Adds the objects that are needed for Adobe.PPKLite to read the signature.
 * Also includes a placeholder for the actual signature.
 * Returns an Object with all the added PDFReferences.
 * @param {PDFDocument} pdf
 * @param {string} reason
 * @returns {object}
 */
export declare function pdfkitAddPlaceholder(opts: PDFKitAddPlaceholderOpts): any;
