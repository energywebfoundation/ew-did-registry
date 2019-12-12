
/* eslint-disable class-methods-use-this */
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
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const claim_1 = __importDefault(require('./claim'));

const VerificationClaim = /** @class */ (function (_super) {
  __extends(VerificationClaim, _super);
  function VerificationClaim() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  VerificationClaim.prototype.approve = function () {
    return '';
  };
  VerificationClaim.prototype.verify = function () {
    return false;
  };
  return VerificationClaim;
}(claim_1.default));
exports.default = VerificationClaim;
// # sourceMappingURL=verificationClaim.js.map
