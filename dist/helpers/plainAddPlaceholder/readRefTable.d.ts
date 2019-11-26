/// <reference types="node" />
/**
 * @param {Buffer} pdfBuffer
 * @returns {RefTable}
 */
export declare function readRefTable(pdf: Buffer): RefTable;
export interface RefTable {
    maxOffset: number;
    startingIndex: number;
    maxIndex: number;
    offsets: Map<number, number>;
}
