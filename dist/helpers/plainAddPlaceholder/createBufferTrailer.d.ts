/// <reference types="node" />
import { PdfInfo } from './readPdf';
export declare function createBufferTrailer(pdf: Buffer, info: PdfInfo, addedReferences: Map<number, number>): Buffer;
