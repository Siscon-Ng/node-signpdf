import { DEFAULT_BYTE_RANGE_PLACEHOLDER, DEFAULT_SIGNATURE_LENGTH } from './const';

import { PDFKitReferenceMock } from './pdfkitReferenceMock';

export interface PDFKitAddPlaceholderOpts {
    pdf: any;
    pdfBuffer: Buffer;
    reason?: string;
    signatureLength?: number;
    byteRangePlaceholder?: string;
}

const defaultOpts = {
    signatureLength: DEFAULT_SIGNATURE_LENGTH,
    byteRangePlaceholder: DEFAULT_BYTE_RANGE_PLACEHOLDER
};

/**
 * Adds the objects that are needed for Adobe.PPKLite to read the signature.
 * Also includes a placeholder for the actual signature.
 * Returns an Object with all the added PDFReferences.
 * @param {PDFDocument} pdf
 * @param {string} reason
 * @returns {object}
 */
export function pdfkitAddPlaceholder(opts: PDFKitAddPlaceholderOpts): any {

    const { pdf, pdfBuffer, reason, signatureLength, byteRangePlaceholder } = { ...defaultOpts, ...opts };

    // Generate the signature placeholder
    const signature = pdf.ref({
        Type: 'Sig',
        Filter: 'Adobe.PPKLite',
        SubFilter: 'adbe.pkcs7.detached',
        ByteRange: [
            0,
            byteRangePlaceholder,
            byteRangePlaceholder,
            byteRangePlaceholder,
        ],
        Contents: Buffer.from(String.fromCharCode(0).repeat(signatureLength)),
        // tslint:disable:no-construct
        Reason: new String(reason),
        M: new Date(),
        ContactInfo: new String('emailfromp1289@gmail.com'),
        Name: new String('Name from p12'),
        Location: new String('Location from p12'),
    });

    // Check if pdf already contains acroform field
    const acroFormPosition = pdfBuffer.lastIndexOf('/Type /AcroForm');
    const isAcroFormExists = acroFormPosition !== -1;
    let fieldIds: any[] = [];
    let acroFormId;

    if (isAcroFormExists) {
        const pdfSlice = pdfBuffer.slice(acroFormPosition - 12);
        const acroForm = pdfSlice.slice(0, pdfSlice.indexOf('endobj')).toString();
        const acroFormFirsRow = acroForm.split('\n')[0];
        acroFormId = parseInt(acroFormFirsRow.split(' ')[0]);

        const acroFormFields = acroForm.slice(acroForm.indexOf('/Fields [') + 9, acroForm.indexOf(']'));
        fieldIds = acroFormFields
            .split(' ')
            .filter((element, index) => index % 3 === 0)
            .map(fieldId => new PDFKitReferenceMock(fieldId));
    }
    const signatureName = 'Signature';

    // Generate signature annotation widget
    const widget = pdf.ref({
        Type: 'Annot',
        Subtype: 'Widget',
        FT: 'Sig',
        Rect: [0, 0, 0, 0],
        V: signature,
        T: new String(signatureName + (fieldIds.length + 1)),
        F: 4,
        P: pdf.page.dictionary
    });
    pdf.page.dictionary.data.Annots = [widget];
    // Include the widget in a page
    let form;

    if (!isAcroFormExists) {
        // Create a form (with the widget) and link in the _root
        form = pdf.ref({
            Type: 'AcroForm',
            SigFlags: 3,
            Fields: [...fieldIds, widget],
        });
    } else {
        // Use existing acroform and extend the fields with newly created widgets
        form = pdf.ref({
            Type: 'AcroForm',
            SigFlags: 3,
            Fields: [...fieldIds, widget],
        }, acroFormId);
    }
    pdf._root.data.AcroForm = form;

    return {
        signature,
        form,
        widget,
    };
}
