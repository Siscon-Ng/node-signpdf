/// <reference types="node" />
export interface Signature {
    ByteRange: Number[];
    signature: string;
    signedData: Buffer;
}
/**
 * Basic implementation of signature extraction.
 *
 * Really basic. Would work in the simplest of cases where there is only one signature
 * in a document and ByteRange is only used once in it.
 *
 * @param {Buffer} pdf
 * @returns {Signature} {ByteRange: Number[], signature: Buffer, signedData: Buffer}
 */
export declare function extractSignature(pdf: Buffer, signatureCount?: number): Signature;
