import PDFAbstractReference from './pdfkit/abstract_reference';
export declare class PDFKitReferenceMock extends PDFAbstractReference {
    index: number | string;
    constructor(index: number | string, additionalData?: any);
    toString(): string;
}
