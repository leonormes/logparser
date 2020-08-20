"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log_timer_1 = require("./log_timer");
const LogStat_1 = require("./LogStat");
const Output_1 = require("./Output");
class CacheLogs {
    constructor(output_type) {
        this.output = Output_1.LogOutput.getOutputer(output_type);
        this.log_stat_map = new Map();
        this.done_set = new Set();
        this.log_times = new log_timer_1.LogTimes();
    }
    set(uuid, log) {
        const logStat = this.pre_set(uuid);
        if (!logStat) {
            return;
        }
        logStat.set_prop(log);
        this.log_times.set(log, uuid);
        this.post_set();
    }
    incomplete() {
        console.error(this.log_stat_map.entries());
    }
    pre_set(uuid) {
        if (this.done_set.has(uuid)) {
            return;
        }
        const logStat = this.get_stat(uuid);
        return logStat;
    }
    post_set() {
        const forget = this.log_times.vacuum();
        if (forget && forget.length > 0) {
            this.finish_log(forget);
        }
    }
    get_stat(uuid) {
        if (this.log_stat_map.has(uuid)) {
            return this.log_stat_map.get(uuid);
        }
        else {
            const ls = new LogStat_1.LogStat();
            this.log_stat_map.set(uuid, ls);
            return ls;
        }
    }
    finish_log(forget) {
        forget.forEach(uuid => {
            const logStat = this.get_stat(uuid);
            if (!logStat) {
                return;
            }
            if (logStat.done()) {
                const m = Object.assign({ uuid }, logStat.get_prop());
                this.output.print(m);
            }
            this.done_set.add(uuid);
            this.log_stat_map.delete(uuid);
        });
    }
}
exports.CacheLogs = CacheLogs;
//# sourceMappingURL=cache.js.map