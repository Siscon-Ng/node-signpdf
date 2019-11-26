import { getPagesDictionaryRef } from './getPagesDictionaryRef';
import { ERROR_TYPE_PARSE, SignPdfError } from '../../SignPdfError';

describe('getPagesDictionaryRef', () => {
    it('Errors when pages descriptor is not found', () => {
        const info = {
            root: '/Catalog',
        };

        try {
            getPagesDictionaryRef(info);
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(ERROR_TYPE_PARSE);
            expect(e.message).toMatchSnapshot();
        }
    });
});
