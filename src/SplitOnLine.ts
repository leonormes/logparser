import stream, { TransformOptions } from 'stream';
import { LineFilterer } from './LineFilterer';
export class SplitOnLine extends stream.Transform {
    public line_accumulator: string | undefined;
    private filterer: LineFilterer;
    constructor(opts?: TransformOptions) {
        super(opts);
        this.line_accumulator = '';
        this.filterer = new LineFilterer();
    }
    _transform(chunk: Buffer | string, encoding: string, next: () => void) {
        const lines = (
            (this.line_accumulator != null ? this.line_accumulator : '') + chunk.toString()
        ).split(/\r?\n/);
        this.line_accumulator = lines.pop();
        for (let line of lines) {
            const l = this.filterer.filter_line(line);
            if (l) {
                this.push(l);
            }
        }
        next();
    }
    _flush(done: () => void) {
        this.push(this.line_accumulator != null ? this.line_accumulator : '');
        done();
    }
}
