/// <reference types="node" />
export interface InfoSignature {
    reason: string;
    contactInfo?: string;
    name?: string;
    location?: string;
    positionBBox?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
}
export interface PdflibAddPlaceholderOpts {
    pdfBuffer: Buffer;
    infoSignature: InfoSignature;
    signatureLength?: number;
    byteRangePlaceholder?: string;
}
export declare function pdflibAddPlaceholder(opts: PdflibAddPlaceholderOpts): Promise<Buffer>;
