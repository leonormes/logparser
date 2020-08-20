"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const once = (fn) => {
    let done = false;
    return function (...args) {
        return done ? void 0 : ((done = true), fn.apply(this, args));
    };
};
class LogOutput {
    static getOutputer(key) {
        switch (key) {
            case 'csv':
                return new CSVOutput();
            case 'json':
                return new JSONOutput();
            default:
                return new CSVOutput();
        }
    }
}
exports.LogOutput = LogOutput;
class CSVOutput {
    constructor() {
        this.print_headers = once((logStat) => {
            console.log(Object.keys(logStat).join(','));
        });
    }
    print(logStat) {
        this.print_headers(logStat);
        console.log(Object.values(logStat).join(','));
    }
}
exports.CSVOutput = CSVOutput;
class JSONOutput {
    print(logStat) {
        console.log(JSON.stringify(logStat));
    }
}
exports.JSONOutput = JSONOutput;
//# sourceMappingURL=Output.js.map