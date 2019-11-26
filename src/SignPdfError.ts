// TODO use enum?
export const ERROR_TYPE_UNKNOWN = 1;
export const ERROR_TYPE_INPUT = 2;
export const ERROR_TYPE_PARSE = 3;
export const ERROR_VERIFY_SIGNATURE = 4;

export class SignPdfError extends Error {
    constructor(msg: string, public type = ERROR_TYPE_UNKNOWN) {
        super(msg);
    }
}
