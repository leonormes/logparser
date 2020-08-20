import { CacheLogs } from './cache';
import { LineFilterer } from './LineFilterer';
import { SplitOnLine } from './SplitOnLine';

const filterer = new LineFilterer();
const cachelog = new CacheLogs(process.argv[2]);

const split_on_line = new SplitOnLine();

process.stdin
    .pipe(split_on_line)
    .on('data', (data: Buffer) => {
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
