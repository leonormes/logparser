"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonify_1 = require("./jsonify");
class LogTimes {
    constructor() {
        this.time_map = new Map();
        this.timings = [];
    }
    get_log_time(log) {
        if (!log) {
            return;
        }
        const obj = jsonify_1.jsonify(log);
        if (!obj) {
            return;
        }
        const date = obj.date;
        if (date) {
            return date.split('.')[0];
        }
    }
    set(log, uuid) {
        const time = this.get_log_time(log);
        if (!time) {
            return;
        }
        const t = new Date(time).getTime();
        this.timings.push(t);
        const uuid_set = this.time_map.get(t);
        if (uuid_set) {
            uuid_set.add(uuid);
        }
        else {
            const us = new Set();
            us.add(uuid);
            this.time_map.set(t, us);
        }
    }
    vacuum() {
        const latest_time = this.timings.slice(-1).pop();
        if (!latest_time) {
            return;
        }
        const oldest_time_to_keep = this.timings.find(t => latest_time - t < 200000);
        if (!oldest_time_to_keep) {
            return;
        }
        const index = this.timings.indexOf(oldest_time_to_keep);
        let rid = this.timings.splice(0, index - 1);
        let setToArr = [];
        rid.forEach(i => {
            const t = this.time_map.get(i);
            if (!t) {
                return;
            }
            setToArr.push(...t);
            this.time_map.delete(i);
        });
        return setToArr;
    }
}
exports.LogTimes = LogTimes;
//# sourceMappingURL=log_timer.js.map