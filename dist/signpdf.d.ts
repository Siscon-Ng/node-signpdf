/// <reference types="node" />
export declare const DEFAULT_BYTE_RANGE_PLACEHOLDER = "**********";
export declare class SignPdf {
    lastSignature: string | null;
    private byteRangePlaceholder;
    sign(pdfBuffer: Buffer, p12Buffer: Buffer, additionalOptions?: {}): Buffer;
}
declare const _default: SignPdf;
export default _default;
