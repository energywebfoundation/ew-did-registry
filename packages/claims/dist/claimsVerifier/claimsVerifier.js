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
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
var sjcl_complete_1 = __importDefault(require("sjcl-complete"));
var did_resolver_1 = require("@ew-did-registry/did-resolver");
var claims_1 = require("../claims");
var bn = sjcl_complete_1.default.bn, hash = sjcl_complete_1.default.hash;
var ClaimsVerifier = /** @class */ (function (_super) {
    __extends(ClaimsVerifier, _super);
    function ClaimsVerifier() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Checks issuer signature on token
     *
     * @example
     * ```typescript
     * import { ClaimsVerifier } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keys = new Keys();
     * const claims = new ClaimsVerifier(verifier);
     * const verified = claims.verifyPublicProof(issuedToken);
     * ```
     * @param { string } token containing proof data
     * @returns { Promise<void> } whether the proof was succesfull
     * @throws if the proof failed
     */
    ClaimsVerifier.prototype.verifyPublicProof = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var claim, resolver;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        claim = this.jwt.decode(token);
                        return [4 /*yield*/, this.verifySignature(token, claim.signer)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error('Invalid signatue');
                        }
                        resolver = new did_resolver_1.Resolver();
                        if (!resolver.validDelegate(claim.did, did_resolver_1.DelegateTypes.verification, claim.signer)) {
                            throw new Error('Issuer isn\'t a use\'r delegate');
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
    * Checks issuer signature on issued token and user signature on proof token
    * and verifies that proof and private data mathches to each other
    *
    * @example
    * ```typescript
    * import { ClaimsVerifier } from '@ew-did-registry/claims';
    * import { Keys } from '@ew-did-registry/keys';
    *
    * const keys = new Keys();
    * const claims = new ClaimsVerifier(verifier);
    * const verified = claims.verifyPrivateProof(proofToken, privateToken);
    * ```
    * @param { string } proofToken contains proof data
    * @param { string } privateToken contains private data
    * @returns { Promise<void> } whether the proof was succesfull
    * @throws if the proof failed
    */
    ClaimsVerifier.prototype.verifyPrivateProof = function (proofToken, privateToken) {
        return __awaiter(this, void 0, void 0, function () {
            var curve, g, proofClaim, resolver, privateClaim, _i, _a, _b, key, value, PK, _c, h, s, c, left, right;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        curve = sjcl_complete_1.default.ecc.curves.k256;
                        g = curve.G;
                        proofClaim = this.jwt.decode(proofToken);
                        return [4 /*yield*/, this.verifySignature(proofToken, proofClaim.signer)];
                    case 1:
                        if (!(_d.sent())) {
                            throw new Error('Invalid signature');
                        }
                        resolver = new did_resolver_1.Resolver();
                        privateClaim = this.jwt.decode(privateToken);
                        return [4 /*yield*/, this.verifySignature(privateToken, privateClaim.signer)];
                    case 2:
                        if (!(_d.sent())) {
                            throw new Error('Invalid signature');
                        }
                        if (!resolver
                            .validDelegate(privateClaim.did, did_resolver_1.DelegateTypes.verification, privateClaim.signer)) {
                            throw new Error('Issuer isn\'t a use\'r delegate');
                        }
                        // eslint-disable-next-line no-restricted-syntax
                        for (_i = 0, _a = Object.entries(privateClaim.privateData); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            PK = curve.fromBits(value);
                            _c = proofClaim.privateData[key], h = _c.h, s = _c.s;
                            h = curve.fromBits(h);
                            s = bn.fromBits(s);
                            c = hash.sha256.hash(g.x.toBits()
                                .concat(h.toBits())
                                .concat(PK.toBits()));
                            c = bn.fromBits(c);
                            left = g.mult(s);
                            right = PK.mult(c).toJac().add(h).toAffine();
                            if (!sjcl_complete_1.default.bitArray.equal(left.toBits(), right.toBits())) {
                                throw new Error('User didn\'t prove the knowledge of the private data');
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return ClaimsVerifier;
}(claims_1.Claims));
exports.ClaimsVerifier = ClaimsVerifier;
//# sourceMappingURL=claimsVerifier.js.map