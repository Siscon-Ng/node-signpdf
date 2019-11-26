import { removeTrailingNewLine } from './removeTrailingNewLine';
import { ERROR_TYPE_INPUT, ERROR_TYPE_PARSE, SignPdfError } from '../SignPdfError';

describe('removeTrailingNewLine', () => {
    it('expects PDF to be Buffer', () => {
        try {
            removeTrailingNewLine('non-buffer' as any as Buffer);
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(ERROR_TYPE_INPUT);
        }
    });
    it('errors if there is no EOF', () => {
        try {
            const source = Buffer.from('something with no new line');
            removeTrailingNewLine(source);
            expect('here').not.toBe('here');
        } catch (e) {
            expect(e instanceof SignPdfError).toBe(true);
            expect(e.type).toBe(ERROR_TYPE_PARSE);
        }
    });
    it('returns source if there is no trailing new line', () => {
        const source = Buffer.from('something with no new line\n%%EOF');
        const result = removeTrailingNewLine(source);
        expect(result).toEqual(source);
    });
    it('removes a trailing new line', () => {
        const source = Buffer.from('something with a new line\n%%EOF\n');
        const result = removeTrailingNewLine(source);
        expect(result.toString()).toEqual('something with a new line\n%%EOF');
    });
});
