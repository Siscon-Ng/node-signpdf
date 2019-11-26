export declare const ERROR_TYPE_UNKNOWN = 1;
export declare const ERROR_TYPE_INPUT = 2;
export declare const ERROR_TYPE_PARSE = 3;
export declare const ERROR_VERIFY_SIGNATURE = 4;
export declare class SignPdfError extends Error {
    type: number;
    constructor(msg: string, type?: number);
}
