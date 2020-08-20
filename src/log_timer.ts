import { jsonify } from './jsonify';

interface ILogTimes {
    set: (time: string, uuid: string) => void;
    vacuum: () => string[] | undefined;
}

export class LogTimes implements ILogTimes {
    private time_map: Map<number, Set<string>>;
    private timings: number[];
    constructor() {
        this.time_map = new Map();
        this.timings = [];
    }
    private get_log_time(log: string): string | undefined {
        if (!log) {
            return;
        }
        const obj = jsonify(log);
        if (!obj) {
            return;
        }

        const date: string = obj.date;
        if (date) {
            return date.split('.')[0];
        }
    }
    public set(log: string, uuid: string) {
        const time = this.get_log_time(log);
        if (!time) {
            return;
        }
        const t = new Date(time).getTime();
        this.timings.push(t);
        const uuid_set = this.time_map.get(t);
        if (uuid_set) {
            uuid_set.add(uuid);
        } else {
            const us = new Set<string>();
            us.add(uuid);
            this.time_map.set(t, us);
        }
    }
    public vacuum(): string[] | undefined {
        const latest_time = this.timings.slice(-1).pop();
        if (!latest_time) {
            return;
        }
        const oldest_time_to_keep = this.timings.find(t => latest_time - t < 200000);
        if (!oldest_time_to_keep) {
            return;
        }
        const index = this.timings.indexOf(oldest_time_to_keep);
        let rid: number[] = this.timings.splice(0, index - 1);
        let setToArr: string[] = [];
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
