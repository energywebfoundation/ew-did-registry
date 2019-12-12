"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Claim = /** @class */ (function () {
    function Claim(data) {
        this.jwt = data.jwt;
        this.keyPair = data.keyPair;
        this.claimData = data.claimData;
        this.claimData = data.claimData;
    }
    Claim.prototype.getDid = function () {
        return '';
    };
    return Claim;
}());
exports.default = Claim;
//# sourceMappingURL=claim.js.map