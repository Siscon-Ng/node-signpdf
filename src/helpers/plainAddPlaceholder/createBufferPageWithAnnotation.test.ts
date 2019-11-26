import { createBufferPageWithAnnotation } from './createBufferPageWithAnnotation';
import { findObject } from './findObject';
import { ERROR_TYPE_PARSE, SignPdfError } from '../../SignPdfError';

jest.mock('./findObject', () => ({
    __esModule: true,
    default: jest.fn(),
}));

describe('createBufferPageWithAnnotation', () => {
    it('should be tested', () => {
    });
//     it('Reports unsupported feature', () => {
//         findObject.mockImplementation(() => '/Annots Exists');
//         try {
//             createBufferPageWithAnnotation('pdf', 'info', 'pageRef', 'widget');
//             expect('here').not.toBe('here');
//         } catch (e) {
//             expect(e instanceof SignPdfError).toBe(true);
//             expect(e.type).toBe(ERROR_TYPE_PARSE);
//             expect(e.message).toMatchSnapshot();
//         }
//     });
});
