/// <reference types="node" />
export interface PlainAddPlaceholderOpts {
    pdfBuffer: Buffer;
    reason: string;
    signatureLength?: number;
}
/**
 * Adds a signature placeholder to a PDF Buffer.
 *
 * This contrasts with the default pdfkit-based implementation.
 * Parsing is done using simple string operations.
 * Adding is done with `Buffer.concat`.
 * This allows node-signpdf to be used on any PDF and
 * not only on a freshly created through PDFKit one.
 */
export declare function plainAddPlaceholder(opts: PlainAddPlaceholderOpts): Buffer;
