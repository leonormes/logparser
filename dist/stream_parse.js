"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cache_1 = require("./cache");
const LineFilterer_1 = require("./LineFilterer");
const SplitOnLine_1 = require("./SplitOnLine");
const filterer = new LineFilterer_1.LineFilterer();
const cachelog = new cache_1.CacheLogs(process.argv[2]);
const split_on_line = new SplitOnLine_1.SplitOnLine();
process.stdin
    .pipe(split_on_line)
    .on('data', (data) => {
    const line = data.toString();
    if (!line) {
        return;
    }
    const uuid_match = filterer.get_uuid(line);
    if (uuid_match && uuid_match[0] && uuid_match.input) {
        cachelog.set(uuid_match[0], uuid_match.input);
    }
})
    .on('finish', () => {
    cachelog.incomplete();
});
//# sourceMappingURL=stream_parse.js.map