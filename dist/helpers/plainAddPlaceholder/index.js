"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdfobject_1 = require("../pdfkit/pdfobject");
const pdfkitReferenceMock_1 = require("../pdfkitReferenceMock");
const removeTrailingNewLine_1 = require("../removeTrailingNewLine");
const const_1 = require("../const");
const pdfkitAddPlaceholder_1 = require("../pdfkitAddPlaceholder");
const getIndexFromRef_1 = require("./getIndexFromRef");
const readPdf_1 = require("./readPdf");
const getPageRef_1 = require("./getPageRef");
const createBufferRootWithAcroform_1 = require("./createBufferRootWithAcroform");
const createBufferPageWithAnnotation_1 = require("./createBufferPageWithAnnotation");
const createBufferTrailer_1 = require("./createBufferTrailer");
const isContainBufferRootWithAcroform = (pdf) => {
    const bufferRootWithAcroformRefRegex = new RegExp('\\/AcroForm\\s+(\\d+\\s\\d+\\sR)', 'g');
    const match = bufferRootWithAcroformRefRegex.exec(pdf.toString());
    return match != null && match[1] != null && match[1] !== '';
};
/**
 * Adds a signature placeholder to a PDF Buffer.
 *
 * This contrasts with the default pdfkit-based implementation.
 * Parsing is done using simple string operations.
 * Adding is done with `Buffer.concat`.
 * This allows node-signpdf to be used on any PDF and
 * not only on a freshly created through PDFKit one.
 */
function plainAddPlaceholder(opts) {
    const { pdfBuffer, reason, signatureLength } = { signatureLength: const_1.DEFAULT_SIGNATURE_LENGTH, ...opts };
    let pdf = removeTrailingNewLine_1.removeTrailingNewLine(pdfBuffer);
    const info = readPdf_1.readPdf(pdf);
    const pageRef = getPageRef_1.getPageRef(pdf, info);
    const pageIndex = getIndexFromRef_1.getIndexFromRef(info.xref, pageRef);
    const addedReferences = new Map();
    const pdfKitMock = {
        ref: (input, additionalIndex) => {
            info.xref.maxIndex += 1;
            const index = additionalIndex != null ? additionalIndex : info.xref.maxIndex;
            addedReferences.set(index, pdf.length + 1); // + 1 new line
            pdf = Buffer.concat([
                pdf,
                Buffer.from('\n'),
                Buffer.from(`${index} 0 obj\n`),
                Buffer.from(pdfobject_1.default.convert(input)),
                Buffer.from('\nendobj\n'),
            ]);
            return new pdfkitReferenceMock_1.PDFKitReferenceMock(info.xref.maxIndex);
        },
        page: {
            dictionary: new pdfkitReferenceMock_1.PDFKitReferenceMock(pageIndex, {
                data: {
                    Annots: [],
                },
            }),
        },
        _root: {
            data: {},
        },
    };
    const { form, widget } = pdfkitAddPlaceholder_1.pdfkitAddPlaceholder({
        pdf: pdfKitMock,
        pdfBuffer,
        reason,
        signatureLength,
    });
    if (!isContainBufferRootWithAcroform(pdf)) {
        const rootIndex = getIndexFromRef_1.getIndexFromRef(info.xref, info.rootRef);
        addedReferences.set(rootIndex, pdf.length + 1);
        pdf = Buffer.concat([
            pdf,
            Buffer.from('\n'),
            createBufferRootWithAcroform_1.createBufferRootWithAcroform(pdf, info, form),
        ]);
    }
    addedReferences.set(pageIndex, pdf.length + 1);
    pdf = Buffer.concat([
        pdf,
        Buffer.from('\n'),
        createBufferPageWithAnnotation_1.createBufferPageWithAnnotation(pdf, info, pageRef, widget),
    ]);
    pdf = Buffer.concat([
        pdf,
        Buffer.from('\n'),
        createBufferTrailer_1.createBufferTrailer(pdf, info, addedReferences),
    ]);
    return pdf;
}
exports.plainAddPlaceholder = plainAddPlaceholder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaGVscGVycy9wbGFpbkFkZFBsYWNlaG9sZGVyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbURBQTRDO0FBQzVDLGdFQUE2RDtBQUM3RCxvRUFBaUU7QUFDakUsb0NBQW9EO0FBQ3BELGtFQUErRDtBQUUvRCx1REFBb0Q7QUFDcEQsdUNBQW9DO0FBQ3BDLDZDQUEwQztBQUMxQyxpRkFBOEU7QUFDOUUscUZBQWtGO0FBQ2xGLCtEQUE0RDtBQUU1RCxNQUFNLCtCQUErQixHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7SUFDcEQsTUFBTSw4QkFBOEIsR0FBRyxJQUFJLE1BQU0sQ0FBQyxrQ0FBa0MsRUFBRSxHQUFHLENBQUMsQ0FBQztJQUMzRixNQUFNLEtBQUssR0FBRyw4QkFBOEIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFbEUsT0FBTyxLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNoRSxDQUFDLENBQUM7QUFRRjs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLElBQTZCO0lBQzdELE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLEVBQUUsZUFBZSxFQUFFLGdDQUF3QixFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7SUFHdEcsSUFBSSxHQUFHLEdBQUcsNkNBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDM0MsTUFBTSxJQUFJLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixNQUFNLE9BQU8sR0FBRyx1QkFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN0QyxNQUFNLFNBQVMsR0FBRyxpQ0FBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdEQsTUFBTSxlQUFlLEdBQUcsSUFBSSxHQUFHLEVBQWtCLENBQUM7SUFFbEQsTUFBTSxVQUFVLEdBQUc7UUFDZixHQUFHLEVBQUUsQ0FBQyxLQUFVLEVBQUUsZUFBd0IsRUFBRSxFQUFFO1lBQzFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQztZQUV4QixNQUFNLEtBQUssR0FBRyxlQUFlLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBRTdFLGVBQWUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxlQUFlO1lBRTNELEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNoQixHQUFHO2dCQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxVQUFVLENBQUM7Z0JBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQVMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDO2FBQzVCLENBQUMsQ0FBQztZQUNILE9BQU8sSUFBSSx5Q0FBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxJQUFJLEVBQUU7WUFDRixVQUFVLEVBQUUsSUFBSSx5Q0FBbUIsQ0FDL0IsU0FBUyxFQUNUO2dCQUNJLElBQUksRUFBRTtvQkFDRixNQUFNLEVBQUUsRUFBRTtpQkFDYjthQUNKLENBQ0o7U0FDSjtRQUNELEtBQUssRUFBRTtZQUNILElBQUksRUFBRSxFQUFFO1NBQ1g7S0FDSixDQUFDO0lBRUYsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRywyQ0FBb0IsQ0FBQztRQUMxQyxHQUFHLEVBQUUsVUFBVTtRQUNmLFNBQVM7UUFDVCxNQUFNO1FBQ04sZUFBZTtLQUNsQixDQUFDLENBQUM7SUFFSCxJQUFJLENBQUMsK0JBQStCLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdkMsTUFBTSxTQUFTLEdBQUcsaUNBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMzRCxlQUFlLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9DLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2hCLEdBQUc7WUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztZQUNqQiwyREFBNEIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztTQUNoRCxDQUFDLENBQUM7S0FDTjtJQUNELGVBQWUsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDL0MsR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsR0FBRztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ2pCLCtEQUE4QixDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQztLQUM3RCxDQUFDLENBQUM7SUFFSCxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixHQUFHO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDakIseUNBQW1CLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxlQUFlLENBQUM7S0FDbEQsQ0FBQyxDQUFDO0lBRUgsT0FBTyxHQUFHLENBQUM7QUFDZixDQUFDO0FBeEVELGtEQXdFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQREZPYmplY3QgZnJvbSAnLi4vcGRma2l0L3BkZm9iamVjdCc7XG5pbXBvcnQgeyBQREZLaXRSZWZlcmVuY2VNb2NrIH0gZnJvbSAnLi4vcGRma2l0UmVmZXJlbmNlTW9jayc7XG5pbXBvcnQgeyByZW1vdmVUcmFpbGluZ05ld0xpbmUgfSBmcm9tICcuLi9yZW1vdmVUcmFpbGluZ05ld0xpbmUnO1xuaW1wb3J0IHsgREVGQVVMVF9TSUdOQVRVUkVfTEVOR1RIIH0gZnJvbSAnLi4vY29uc3QnO1xuaW1wb3J0IHsgcGRma2l0QWRkUGxhY2Vob2xkZXIgfSBmcm9tICcuLi9wZGZraXRBZGRQbGFjZWhvbGRlcic7XG5cbmltcG9ydCB7IGdldEluZGV4RnJvbVJlZiB9IGZyb20gJy4vZ2V0SW5kZXhGcm9tUmVmJztcbmltcG9ydCB7IHJlYWRQZGYgfSBmcm9tICcuL3JlYWRQZGYnO1xuaW1wb3J0IHsgZ2V0UGFnZVJlZiB9IGZyb20gJy4vZ2V0UGFnZVJlZic7XG5pbXBvcnQgeyBjcmVhdGVCdWZmZXJSb290V2l0aEFjcm9mb3JtIH0gZnJvbSAnLi9jcmVhdGVCdWZmZXJSb290V2l0aEFjcm9mb3JtJztcbmltcG9ydCB7IGNyZWF0ZUJ1ZmZlclBhZ2VXaXRoQW5ub3RhdGlvbiB9IGZyb20gJy4vY3JlYXRlQnVmZmVyUGFnZVdpdGhBbm5vdGF0aW9uJztcbmltcG9ydCB7IGNyZWF0ZUJ1ZmZlclRyYWlsZXIgfSBmcm9tICcuL2NyZWF0ZUJ1ZmZlclRyYWlsZXInO1xuXG5jb25zdCBpc0NvbnRhaW5CdWZmZXJSb290V2l0aEFjcm9mb3JtID0gKHBkZjogQnVmZmVyKSA9PiB7XG4gICAgY29uc3QgYnVmZmVyUm9vdFdpdGhBY3JvZm9ybVJlZlJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXC9BY3JvRm9ybVxcXFxzKyhcXFxcZCtcXFxcc1xcXFxkK1xcXFxzUiknLCAnZycpO1xuICAgIGNvbnN0IG1hdGNoID0gYnVmZmVyUm9vdFdpdGhBY3JvZm9ybVJlZlJlZ2V4LmV4ZWMocGRmLnRvU3RyaW5nKCkpO1xuXG4gICAgcmV0dXJuIG1hdGNoICE9IG51bGwgJiYgbWF0Y2hbMV0gIT0gbnVsbCAmJiBtYXRjaFsxXSAhPT0gJyc7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFBsYWluQWRkUGxhY2Vob2xkZXJPcHRzIHtcbiAgICBwZGZCdWZmZXI6IEJ1ZmZlcjtcbiAgICByZWFzb246IHN0cmluZztcbiAgICBzaWduYXR1cmVMZW5ndGg/OiBudW1iZXI7XG59XG5cbi8qKlxuICogQWRkcyBhIHNpZ25hdHVyZSBwbGFjZWhvbGRlciB0byBhIFBERiBCdWZmZXIuXG4gKlxuICogVGhpcyBjb250cmFzdHMgd2l0aCB0aGUgZGVmYXVsdCBwZGZraXQtYmFzZWQgaW1wbGVtZW50YXRpb24uXG4gKiBQYXJzaW5nIGlzIGRvbmUgdXNpbmcgc2ltcGxlIHN0cmluZyBvcGVyYXRpb25zLlxuICogQWRkaW5nIGlzIGRvbmUgd2l0aCBgQnVmZmVyLmNvbmNhdGAuXG4gKiBUaGlzIGFsbG93cyBub2RlLXNpZ25wZGYgdG8gYmUgdXNlZCBvbiBhbnkgUERGIGFuZFxuICogbm90IG9ubHkgb24gYSBmcmVzaGx5IGNyZWF0ZWQgdGhyb3VnaCBQREZLaXQgb25lLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGxhaW5BZGRQbGFjZWhvbGRlcihvcHRzOiBQbGFpbkFkZFBsYWNlaG9sZGVyT3B0cyk6IEJ1ZmZlciB7XG4gICAgY29uc3QgeyBwZGZCdWZmZXIsIHJlYXNvbiwgc2lnbmF0dXJlTGVuZ3RoIH0gPSB7IHNpZ25hdHVyZUxlbmd0aDogREVGQVVMVF9TSUdOQVRVUkVfTEVOR1RILCAuLi5vcHRzIH07XG5cblxuICAgIGxldCBwZGYgPSByZW1vdmVUcmFpbGluZ05ld0xpbmUocGRmQnVmZmVyKTtcbiAgICBjb25zdCBpbmZvID0gcmVhZFBkZihwZGYpO1xuICAgIGNvbnN0IHBhZ2VSZWYgPSBnZXRQYWdlUmVmKHBkZiwgaW5mbyk7XG4gICAgY29uc3QgcGFnZUluZGV4ID0gZ2V0SW5kZXhGcm9tUmVmKGluZm8ueHJlZiwgcGFnZVJlZik7XG4gICAgY29uc3QgYWRkZWRSZWZlcmVuY2VzID0gbmV3IE1hcDxudW1iZXIsIG51bWJlcj4oKTtcblxuICAgIGNvbnN0IHBkZktpdE1vY2sgPSB7XG4gICAgICAgIHJlZjogKGlucHV0OiBhbnksIGFkZGl0aW9uYWxJbmRleD86IG51bWJlcikgPT4ge1xuICAgICAgICAgICAgaW5mby54cmVmLm1heEluZGV4ICs9IDE7XG5cbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gYWRkaXRpb25hbEluZGV4ICE9IG51bGwgPyBhZGRpdGlvbmFsSW5kZXggOiBpbmZvLnhyZWYubWF4SW5kZXg7XG5cbiAgICAgICAgICAgIGFkZGVkUmVmZXJlbmNlcy5zZXQoaW5kZXgsIHBkZi5sZW5ndGggKyAxKTsgLy8gKyAxIG5ldyBsaW5lXG5cbiAgICAgICAgICAgIHBkZiA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgICAgIHBkZixcbiAgICAgICAgICAgICAgICBCdWZmZXIuZnJvbSgnXFxuJyksXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20oYCR7aW5kZXh9IDAgb2JqXFxuYCksXG4gICAgICAgICAgICAgICAgQnVmZmVyLmZyb20oUERGT2JqZWN0LmNvbnZlcnQoaW5wdXQpKSxcbiAgICAgICAgICAgICAgICBCdWZmZXIuZnJvbSgnXFxuZW5kb2JqXFxuJyksXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUERGS2l0UmVmZXJlbmNlTW9jayhpbmZvLnhyZWYubWF4SW5kZXgpO1xuICAgICAgICB9LFxuICAgICAgICBwYWdlOiB7XG4gICAgICAgICAgICBkaWN0aW9uYXJ5OiBuZXcgUERGS2l0UmVmZXJlbmNlTW9jayhcbiAgICAgICAgICAgICAgICBwYWdlSW5kZXgsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBBbm5vdHM6IFtdLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICApLFxuICAgICAgICB9LFxuICAgICAgICBfcm9vdDoge1xuICAgICAgICAgICAgZGF0YToge30sXG4gICAgICAgIH0sXG4gICAgfTtcblxuICAgIGNvbnN0IHsgZm9ybSwgd2lkZ2V0IH0gPSBwZGZraXRBZGRQbGFjZWhvbGRlcih7XG4gICAgICAgIHBkZjogcGRmS2l0TW9jayxcbiAgICAgICAgcGRmQnVmZmVyLFxuICAgICAgICByZWFzb24sXG4gICAgICAgIHNpZ25hdHVyZUxlbmd0aCxcbiAgICB9KTtcblxuICAgIGlmICghaXNDb250YWluQnVmZmVyUm9vdFdpdGhBY3JvZm9ybShwZGYpKSB7XG4gICAgICAgIGNvbnN0IHJvb3RJbmRleCA9IGdldEluZGV4RnJvbVJlZihpbmZvLnhyZWYsIGluZm8ucm9vdFJlZik7XG4gICAgICAgIGFkZGVkUmVmZXJlbmNlcy5zZXQocm9vdEluZGV4LCBwZGYubGVuZ3RoICsgMSk7XG4gICAgICAgIHBkZiA9IEJ1ZmZlci5jb25jYXQoW1xuICAgICAgICAgICAgcGRmLFxuICAgICAgICAgICAgQnVmZmVyLmZyb20oJ1xcbicpLFxuICAgICAgICAgICAgY3JlYXRlQnVmZmVyUm9vdFdpdGhBY3JvZm9ybShwZGYsIGluZm8sIGZvcm0pLFxuICAgICAgICBdKTtcbiAgICB9XG4gICAgYWRkZWRSZWZlcmVuY2VzLnNldChwYWdlSW5kZXgsIHBkZi5sZW5ndGggKyAxKTtcbiAgICBwZGYgPSBCdWZmZXIuY29uY2F0KFtcbiAgICAgICAgcGRmLFxuICAgICAgICBCdWZmZXIuZnJvbSgnXFxuJyksXG4gICAgICAgIGNyZWF0ZUJ1ZmZlclBhZ2VXaXRoQW5ub3RhdGlvbihwZGYsIGluZm8sIHBhZ2VSZWYsIHdpZGdldCksXG4gICAgXSk7XG5cbiAgICBwZGYgPSBCdWZmZXIuY29uY2F0KFtcbiAgICAgICAgcGRmLFxuICAgICAgICBCdWZmZXIuZnJvbSgnXFxuJyksXG4gICAgICAgIGNyZWF0ZUJ1ZmZlclRyYWlsZXIocGRmLCBpbmZvLCBhZGRlZFJlZmVyZW5jZXMpLFxuICAgIF0pO1xuXG4gICAgcmV0dXJuIHBkZjtcbn1cbiJdfQ==