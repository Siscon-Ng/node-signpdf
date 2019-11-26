const parseTrailerXref = (prev: any, curr: string) => {
    const isObjectId = curr.split(' ').length === 2;

    if (isObjectId) {
        const [id] = curr.split(' ');
        return {...prev, [id]: undefined};
    }

    const [offset] = curr.split(' ');
    const prevId = Object.keys(prev).find(id => prev[id] === undefined) || ''; // FIXME provide default if not found

    return {...prev, [prevId]: parseInt(offset)};
};

const parseRootXref = (prev: any, l: string, i: number) => {
    const element = l.split(' ')[0];
    const isPageObject = parseInt(element) === 0 && element.length > 3;

    if (isPageObject) {
        return {...prev, 0: 0};
    }

    let [offset] = l.split(' ');

    return {...prev, [i - 1]: parseInt(offset)};
};

const getLastTrailerPosition = (pdf: Buffer) => {
    const trailerStart = pdf.lastIndexOf('trailer');
    const trailer = pdf.slice(trailerStart, pdf.length - 6);

    const xRefPosition = trailer
        .slice(trailer.lastIndexOf('startxref') + 10)
        .toString();

    return parseInt(xRefPosition);
};

const getXref = (pdf: Buffer, position: number) => {
    let refTable = pdf.slice(position);

    refTable = refTable.slice(4);
    refTable = refTable.slice(refTable.indexOf('\n') + 1);
    const size = refTable.toString().split('/Size')[1];
    const [objects, infos] = refTable.toString().split('trailer');

    const isContainingPrev = infos.split('/Prev')[1] != null;

    let prev;
    let reducer;

    if (isContainingPrev) {
        const pagesRefRegex = new RegExp('Prev (\\d+)', 'g');
        const match = pagesRefRegex.exec(infos) as RegExpExecArray;
        const [, prevPosition] = match;
        prev = prevPosition;
        reducer = parseTrailerXref;
    } else {
        reducer = parseRootXref;
    }

    const xRefContent = objects
        .split('\n')
        .filter(l => l !== '')
        .reduce(reducer, {});

    return {
        size,
        prev,
        xRefContent,
    };
};

const getFullXrefTable = (pdf: Buffer): any => {
    const lastTrailerPosition = getLastTrailerPosition(pdf);
    const lastXrefTable = getXref(pdf, lastTrailerPosition);

    if (lastXrefTable.prev === undefined) {
        return lastXrefTable.xRefContent;
    }
    const pdfWithoutLastTrailer = pdf.slice(0, lastTrailerPosition);
    const partOfXrefTable = getFullXrefTable(pdfWithoutLastTrailer);

    const mergedXrefTable = {
        ...partOfXrefTable,
        ...lastXrefTable.xRefContent,
    };

    return mergedXrefTable;
};

/**
 * @param {Buffer} pdfBuffer
 * @returns {RefTable}
 */
export function readRefTable(pdf: Buffer): RefTable {
    const offsetsMap = new Map<number, number>();
    const fullXrefTable = getFullXrefTable(pdf);

    const startingIndex = 0;

    let maxOffset = 0;
    const maxIndex = Object.keys(fullXrefTable).length - 1;

    Object.keys(fullXrefTable).forEach((id) => {
        const offset = parseInt(fullXrefTable[id]);
        maxOffset = Math.max(maxOffset, offset);
        offsetsMap.set(parseInt(id), offset);
    });

    return {
        maxOffset,
        startingIndex,
        maxIndex,
        offsets: offsetsMap,
    };
}

export interface RefTable {
    maxOffset: number;
    startingIndex: number;
    maxIndex: number;
    offsets: Map<number, number>;
}
