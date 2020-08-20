"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonify_1 = require("./jsonify");
class LogStat {
    constructor() {
        this.rcpts = null;
        this.size = null;
        this.content_type = null;
        this.time = null;
        this.num_att = null;
    }
    set_prop(log) {
        const log_obj = jsonify_1.jsonify(log);
        const { size, rcpts, time_total, content_type, is_enc } = log_obj;
        if (time_total) {
            this.time = time_total;
        }
        if (content_type) {
            this.content_type = content_type;
        }
        if (is_enc) {
            this.num_att = log_obj.num;
        }
        if (size) {
            this.size = size;
        }
        if (rcpts) {
            if (typeof rcpts === 'string') {
                const match = rcpts.match(/(\d+)/);
                this.rcpts = parseInt(match[1], 10);
            }
            else {
                this.rcpts = rcpts;
            }
        }
    }
    get_prop() {
        return {
            rcpts: this.rcpts,
            size: this.size,
            time: this.time,
            num_att: this.num_att,
            content_type: this.content_type,
        };
    }
    done() {
        const test = this.rcpts && this.size;
        return !!test;
    }
}
exports.LogStat = LogStat;
//# sourceMappingURL=LogStat.js.map