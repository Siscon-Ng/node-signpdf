import { getIndexFromRef } from './getIndexFromRef';
import { RefTable } from './readRefTable';

/**
 * @param {Buffer} pdf
 * @param {RefTable} refTable
 * @returns {Buffer}
 */
export function findObject(pdf: Buffer, refTable: RefTable, ref: string): Buffer {
    const index = getIndexFromRef(refTable, ref);

    const offset = refTable.offsets.get(index);
    let slice = pdf.slice(offset);
    slice = slice.slice(0, slice.indexOf('endobj'));

    // FIXME: What if it is a stream?
    slice = slice.slice(slice.indexOf('<<') + 2);
    slice = slice.slice(0, slice.lastIndexOf('>>'));
    return slice;
}
