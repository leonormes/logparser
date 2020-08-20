export class LineFilterer {
    private uuidReg: RegExp;
    private lineContentReg: RegExp;
    constructor() {
        this.uuidReg = /\b[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}\b/;
        this.lineContentReg = /size|rcpts|msg times|is_enc|content_type/i;
    }
    public filter_line(line: string) {
        if (this.uuidReg.test(line)) {
            if (this.lineContentReg.test(line)) {
                return line;
            }
        }
    }
    public get_uuid(line: string) {
        return line.match(this.uuidReg);
    }
}
