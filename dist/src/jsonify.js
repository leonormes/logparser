"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function jsonify(log) {
    let obj;
    try {
        obj = JSON.parse(log);
    }
    catch (err) {
        console.error(log);
    }
    if (!obj) {
        return;
    }
    return obj;
}
exports.jsonify = jsonify;
//# sourceMappingURL=jsonify.js.map