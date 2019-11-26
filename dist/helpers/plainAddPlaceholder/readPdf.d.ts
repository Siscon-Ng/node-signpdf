/// <reference types="node" />
import { RefTable } from './readRefTable';
export interface PdfInfo {
    xref: RefTable;
    rootRef: string;
    root: string;
    trailerStart: number;
    previousXrefs: any[];
    xRefPosition: number;
}
/**
 * Simplified parsing of a PDF Buffer.
 * Extracts reference table, root info and trailer start.
 *
 * See section 7.5.5 (File Trailer) of the PDF specs.
 *
 * @param {Buffer} pdfBuffer
 */
export declare function readPdf(pdfBuffer: Buffer): PdfInfo;
