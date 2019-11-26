import PDFAbstractReference from './pdfkit/abstract_reference';

export class PDFKitReferenceMock extends PDFAbstractReference {

    constructor(public index: number | string, additionalData?: any) {
        super();
        if (typeof additionalData !== 'undefined') {
            Object.assign(this, additionalData);
        }
    }

    public toString() {
        return `${this.index} 0 R`;
    }
}
