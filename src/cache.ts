import { jsonify } from './jsonify';
import { LogTimes } from './log_timer';
import { LogStat } from './LogStat';
import { CSVOutput, ILogStatCache, IParserOutput, JSONOutput, LogOutput } from './Output';
interface Icache {
    set: (uuid: string, log: string) => void;
    incomplete: () => void;
}
export class CacheLogs implements Icache {
    private log_times: LogTimes;
    private log_stat_map: Map<string, ILogStatCache>;
    private done_set: Set<string>;
    private output: CSVOutput | JSONOutput;
    constructor(output_type: string | undefined) {
        this.output = LogOutput.getOutputer(output_type);
        this.log_stat_map = new Map();
        this.done_set = new Set();
        this.log_times = new LogTimes();
    }
    public set(uuid: string, log: string) {
        const logStat = this.pre_set(uuid);
        if (!logStat) {
            return;
        }
        logStat.set_prop(log);
        this.log_times.set(log, uuid);
        this.post_set();
    }
    public incomplete() {
        console.error(this.log_stat_map.entries());
    }
    private pre_set(uuid: string) {
        if (this.done_set.has(uuid)) {
            return;
        }
        const logStat = this.get_stat(uuid);
        return logStat;
    }
    private post_set() {
        const forget = this.log_times.vacuum();
        if (forget && forget.length > 0) {
            this.finish_log(forget);
        }
    }
    private get_stat(uuid: string) {
        if (this.log_stat_map.has(uuid)) {
            return this.log_stat_map.get(uuid);
        } else {
            const ls = new LogStat();
            this.log_stat_map.set(uuid, ls);
            return ls;
        }
    }
    private finish_log(forget: string[]) {
        forget.forEach(uuid => {
            const logStat = this.get_stat(uuid);
            if (!logStat) {
                return;
            }
            if (logStat.done()) {
                const m: IParserOutput = { uuid, ...logStat.get_prop() };
                this.output.print(m);
            }
            this.done_set.add(uuid);
            this.log_stat_map.delete(uuid);
        });
    }
}
