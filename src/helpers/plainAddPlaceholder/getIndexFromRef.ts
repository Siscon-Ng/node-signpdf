import { ERROR_TYPE_PARSE, SignPdfError } from '../../SignPdfError';
import { RefTable } from './readRefTable';

/**
 * @param {RefTable} refTable
 * @param {string} ref
 * @returns {number}
 */
export function getIndexFromRef(refTable: RefTable, ref: string): number {
    let [indexStr] = ref.split(' ');
    let index = parseInt(indexStr);

    if (!refTable.offsets.has(index)) {
        throw new SignPdfError(
            `Failed to locate object "${ref}".`,
            ERROR_TYPE_PARSE,
        );
    }
    return index;
}
