"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stream_1 = __importDefault(require("stream"));
const LineFilterer_1 = require("./LineFilterer");
class SplitOnLine extends stream_1.default.Transform {
    constructor(opts) {
        super(opts);
        this.line_accumulator = '';
        this.filterer = new LineFilterer_1.LineFilterer();
    }
    _transform(chunk, encoding, next) {
        const lines = ((this.line_accumulator != null ? this.line_accumulator : '') + chunk.toString()).split(/\r?\n/);
        this.line_accumulator = lines.pop();
        for (let line of lines) {
            const l = this.filterer.filter_line(line);
            if (l) {
                this.push(l);
            }
        }
        next();
    }
    _flush(done) {
        this.push(this.line_accumulator != null ? this.line_accumulator : '');
        done();
    }
}
exports.SplitOnLine = SplitOnLine;
//# sourceMappingURL=SplitOnLine.js.map