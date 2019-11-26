"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_reference_1 = require("./pdfkit/abstract_reference");
class PDFKitReferenceMock extends abstract_reference_1.default {
    constructor(index, additionalData) {
        super();
        this.index = index;
        if (typeof additionalData !== 'undefined') {
            Object.assign(this, additionalData);
        }
    }
    toString() {
        return `${this.index} 0 R`;
    }
}
exports.PDFKitReferenceMock = PDFKitReferenceMock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGRma2l0UmVmZXJlbmNlTW9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9oZWxwZXJzL3BkZmtpdFJlZmVyZW5jZU1vY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvRUFBK0Q7QUFFL0QsTUFBYSxtQkFBb0IsU0FBUSw0QkFBb0I7SUFFekQsWUFBbUIsS0FBc0IsRUFBRSxjQUFvQjtRQUMzRCxLQUFLLEVBQUUsQ0FBQztRQURPLFVBQUssR0FBTCxLQUFLLENBQWlCO1FBRXJDLElBQUksT0FBTyxjQUFjLEtBQUssV0FBVyxFQUFFO1lBQ3ZDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0wsQ0FBQztJQUVNLFFBQVE7UUFDWCxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssTUFBTSxDQUFDO0lBQy9CLENBQUM7Q0FDSjtBQVpELGtEQVlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBERkFic3RyYWN0UmVmZXJlbmNlIGZyb20gJy4vcGRma2l0L2Fic3RyYWN0X3JlZmVyZW5jZSc7XG5cbmV4cG9ydCBjbGFzcyBQREZLaXRSZWZlcmVuY2VNb2NrIGV4dGVuZHMgUERGQWJzdHJhY3RSZWZlcmVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGluZGV4OiBudW1iZXIgfCBzdHJpbmcsIGFkZGl0aW9uYWxEYXRhPzogYW55KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIGlmICh0eXBlb2YgYWRkaXRpb25hbERhdGEgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMsIGFkZGl0aW9uYWxEYXRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyB0b1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIGAke3RoaXMuaW5kZXh9IDAgUmA7XG4gICAgfVxufVxuIl19