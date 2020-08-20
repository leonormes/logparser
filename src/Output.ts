export interface IStats {
    rcpts: number | null;
    size: number | null;
    content_type: string | null;
    time: number | null;
    num_att: number | null;
}
export interface IParserOutput extends IStats {
    uuid: string;
}
export interface ILogStatCache {
    set_prop: (log: string) => void;
    get_prop: () => IStats;
    done: () => boolean;
}

export interface IParserOutput extends IStats {
    uuid: string;
}
interface Outputer {
    print(logStat: IParserOutput): void;
}

const once = <A extends any[], R, T>(
    fn: (this: T, ...arg: A) => R
): ((this: T, ...arg: A) => R | undefined) => {
    let done = false;
    return function(this: T, ...args: A) {
        return done ? void 0 : ((done = true), fn.apply(this, args));
    };
};

export class LogOutput {
    static getOutputer(key?: string) {
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

export class CSVOutput implements Outputer {
    private print_headers: (logStat: IParserOutput) => void;
    constructor() {
        this.print_headers = once((logStat: IStats) => {
            console.log(Object.keys(logStat).join(','));
        });
    }
    public print(logStat: IParserOutput) {
        this.print_headers(logStat);
        console.log(Object.values(logStat).join(','));
    }
}

export class JSONOutput implements Outputer {
    print(logStat: IParserOutput) {
        console.log(JSON.stringify(logStat));
    }
}
