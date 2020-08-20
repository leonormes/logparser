export function jsonify(log: string) {
    let obj;
    try {
        obj = JSON.parse(log);
    } catch (err) {
        console.error(log);
    }
    if (!obj) {
        return;
    }
    return obj;
}
