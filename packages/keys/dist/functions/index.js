"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var hex = {
    encode: function (data) {
        var result = '';
        for (var i = 0; i < data.length; i += 1) {
            var hexValue = data.charCodeAt(i).toString(16);
            result += ("000" + hexValue).slice(-4);
        }
        return result;
    },
};
exports.hex = hex;
var sha256 = function (data) { return crypto_1.createHash('sha256').update(data).digest('hex'); };
exports.sha256 = sha256;
//# sourceMappingURL=index.js.map