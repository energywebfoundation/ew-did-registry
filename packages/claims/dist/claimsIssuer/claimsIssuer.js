"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable new-cap */
var eciesjs_1 = require("eciesjs");
var crypto_1 = __importDefault(require("crypto"));
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
var sjcl_complete_1 = __importDefault(require("sjcl-complete"));
var claims_1 = require("../claims");
var bn = sjcl_complete_1.default.bn;
var ClaimsIssuer = /** @class */ (function (_super) {
    __extends(ClaimsIssuer, _super);
    function ClaimsIssuer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Approve method signs the payload of the provided token with verifiers private key
     * Returns signed token on success
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * import { verificationClaim } from '@ew-did-registry/claims';
     *
     * const keysVerifier = new Keys();
     * const jwtVerifier = new JWT(keysVerifier);
     * const tokenToVerify = publicClaim.token;
     * const dataVerifier = {
     *   jwt: jwtVerifier,
     *   keyPair: keysVerifier,
     *   token: tokenToVerify,
     * };
     *
     * verificationClaim = new VerificationClaim(dataVerifier);
     * const approvedToken = await verificationClaim.approve();
     * console.log(approvedToken)
     * // If verification was successful, verifier can sign the payload of the token
     * // with his private key and return the approved JWT
     * ```
     *
     * @returns {Promise<string>}
     */
    ClaimsIssuer.prototype.issuePublicClaim = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var claim, signedToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        claim = this.jwt.decode(token);
                        claim.signer = this.did;
                        return [4 /*yield*/, this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true })];
                    case 1:
                        signedToken = _a.sent();
                        return [2 /*return*/, signedToken];
                }
            });
        });
    };
    ClaimsIssuer.prototype.issuePrivateClaim = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var curve, g, claim;
            var _this = this;
            return __generator(this, function (_a) {
                curve = sjcl_complete_1.default.ecc.curves.k256;
                g = curve.G;
                claim = this.jwt.decode(token);
                claim.signer = this.did;
                Object.entries(claim.claimData).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    if (['did', 'signer'].includes(key))
                        return;
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    var decryptedField = eciesjs_1.decrypt(_this.keys.privateKey, Buffer.from(value.data));
                    var fieldHash = crypto_1.default.createHash('sha256').update(decryptedField).digest('hex');
                    var PK = g.mult(new bn(fieldHash));
                    claim.claimData[key] = PK.toBits();
                });
                return [2 /*return*/, this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true })];
            });
        });
    };
    return ClaimsIssuer;
}(claims_1.Claims));
exports.ClaimsIssuer = ClaimsIssuer;
exports.default = ClaimsIssuer;
//# sourceMappingURL=claimsIssuer.js.map