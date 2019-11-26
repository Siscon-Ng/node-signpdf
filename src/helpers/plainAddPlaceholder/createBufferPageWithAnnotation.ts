import { findObject } from './findObject';
import { getIndexFromRef } from './getIndexFromRef';
import { PdfInfo } from './readPdf';

export function createBufferPageWithAnnotation(pdf: Buffer, info: PdfInfo, pagesRef: string, widget: any): Buffer {
    const pagesDictionary = findObject(pdf, info.xref, pagesRef).toString();

    // Extend page dictionary with newly created annotations
    const splittedDictionary = pagesDictionary.split('/Annots')[0];
    let splittedIds = pagesDictionary.split('/Annots')[1];
    splittedIds = splittedIds === undefined ? '' : splittedIds.replace(/[\[\]]/g, '');

    const pagesDictionaryIndex = getIndexFromRef(info.xref, pagesRef);
    const widgetValue = widget.toString();

    return Buffer.concat([
        Buffer.from(`${pagesDictionaryIndex} 0 obj\n`),
        Buffer.from('<<\n'),
        Buffer.from(`${splittedDictionary}\n`),
        Buffer.from(`/Annots [${splittedIds} ${widgetValue}]`),
        Buffer.from('\n>>\nendobj\n'),
    ]);
}
