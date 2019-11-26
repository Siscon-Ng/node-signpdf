import { getIndexFromRef } from './getIndexFromRef';
import { ERROR_TYPE_PARSE, SignPdfError } from '../../SignPdfError';
import { RefTable } from './readRefTable';

describe('getIndexFromRef', () => {
    it('Errors when ref is not found', () => {
        const refTable = {
            offsets: new Map(),
        };
        const ref = '50 0 R';

        try {
            getIndexFromRef(refTable as RefTable, ref);
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(ERROR_TYPE_PARSE);
            expect(e.message).toMatchSnapshot();
        }
    });
});
