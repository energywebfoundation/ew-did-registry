
const __extends = (this && this.__extends) || (function () {
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf
            || ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; })
            || function (d, b) { for (const p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
  };
  return function (d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}());
Object.defineProperty(exports, '__esModule', { value: true });
const public_1 = require('../public');

const ProofClaim = /** @class */ (function (_super) {
  __extends(ProofClaim, _super);
  function ProofClaim(data) {
    const _this = _super.call(this, {
      jwt: data.jwt,
      keyPair: data.keyPair,
      token: data.token,
      claimData: data.claimData,
    }) || this;
    _this._hashedFields = data.hashedFields;
    return _this;
  }
  ProofClaim.prototype.verify = function (privateToken) {
    return false;
  };
  return ProofClaim;
}(public_1.Claim));
exports.ProofClaim = ProofClaim;
// # sourceMappingURL=index.js.map
