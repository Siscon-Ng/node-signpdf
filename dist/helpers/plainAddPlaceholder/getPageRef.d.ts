/// <reference types="node" />
import { PdfInfo } from './readPdf';
/**
 * Finds the reference to a page.
 *
 * @param {Buffer} pdfBuffer
 * @param {PdfInfo} info As extracted from readRef()
 */
export declare function getPageRef(pdfBuffer: Buffer, info: PdfInfo): string;
