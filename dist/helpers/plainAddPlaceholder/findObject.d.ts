/// <reference types="node" />
import { RefTable } from './readRefTable';
/**
 * @param {Buffer} pdf
 * @param {RefTable} refTable
 * @returns {Buffer}
 */
export declare function findObject(pdf: Buffer, refTable: RefTable, ref: string): Buffer;
