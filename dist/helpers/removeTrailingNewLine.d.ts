/// <reference types="node" />
/**
 * Removes a trailing new line if there is such.
 *
 * Also makes sure the file ends with an EOF line as per spec.
 * @param {Buffer} pdf
 * @returns {Buffer}
 */
export declare function removeTrailingNewLine(pdf: Buffer): Buffer;
