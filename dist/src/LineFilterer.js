"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class LineFilterer {
    constructor() {
        this.uuidReg = /\b[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}\b/;
        this.lineContentReg = /size|rcpts|msg times|is_enc|content_type/i;
    }
    filter_line(line) {
        if (this.uuidReg.test(line)) {
            if (this.lineContentReg.test(line)) {
                return line;
            }
        }
    }
    get_uuid(line) {
        return line.match(this.uuidReg);
    }
}
exports.LineFilterer = LineFilterer;
//# sourceMappingURL=LineFilterer.js.map