
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const private_1 = require('./private');
const models_1 = require('./models');
const proof_1 = require('./proof');
const verificationClaim_1 = __importDefault(require('./public/verificationClaim'));

const Claims = /** @class */ (function () {
  function Claims(keyPair, didDocument) {
    this._keyPair = keyPair;
    this._didDocument = didDocument;
  }
  Claims.prototype.createPublicClaim = function (claimData) {
    return new verificationClaim_1.default({
      jwt: null,
      keyPair: this._keyPair,
      claimData,
      token: null,
    });
  };
  Claims.prototype.createPrivateClaim = function (claimData, didIssuer) {
    return new private_1.PrivateClaim({
      jwt: null,
      keyPair: this._keyPair,
      token: null,
      claimData,
      issuerDid: didIssuer,
    });
  };
  Claims.prototype.createProofClaim = function (claimData, hashedFields) {
    return new proof_1.ProofClaim({
      jwt: null,
      keyPair: this._keyPair,
      token: null,
      claimData,
      hashedFields,
    });
  };
  Claims.prototype.generateClaimFromToken = function (token, type) {
    const jwt = null; // JWT.decode(token)
    const { claimData } = jwt;
    const { hashedFields } = jwt;
    const { didIssuer } = jwt;
    switch (type) {
      case models_1.ClaimType.Public:
        return this.createPublicClaim(claimData);
      case models_1.ClaimType.Private:
        return this.createPrivateClaim(claimData, hashedFields);
      case models_1.ClaimType.Proof:
        return this.createProofClaim(claimData, didIssuer);
      default:
        return this.createPublicClaim(claimData);
    }
  };
  return Claims;
}());
exports.Claims = Claims;
// # sourceMappingURL=index.js.map
