"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var jwt_1 = require("@ew-did-registry/jwt");
var private_1 = require("../private");
var models_1 = require("../models");
var proof_1 = require("../proof");
var public_1 = require("../public");
var Claims = /** @class */ (function () {
    /**
     *
     * @param {IKeys} keyPair
     * @param {IDidDocumetn} didDocument
     */
    function Claims(keyPair) {
        this._keyPair = keyPair;
    }
    /**
     * Creates verifiable claim with data about subject provided in claimData
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const claims = new Claims(keys);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:my_id',
     *     data: 'data'
     * };
     * const claim = await claims.createPublicClaim(claimData);
     * ```
     * @param {IClaimData } claimData
     *
     * @return {Promise<IVerificationClaim>}
     */
    Claims.prototype.createPublicClaim = function (claimData) {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jwt = new jwt_1.JWT(this._keyPair);
                        return [4 /*yield*/, jwt.sign(claimData)];
                    case 1:
                        token = _a.sent();
                        return [2 /*return*/, new public_1.VerificationClaim({
                                jwt: jwt,
                                keyPair: this._keyPair,
                                token: token,
                            })];
                }
            });
        });
    };
    /**
     * Creates claim which will be sent in encoded form to the didIssuer
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const claims = new Claims(keys);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:my_id',
     *     data: 'secret data'
     * };
     * const didIssuer = 'did:Networks.Ethereum:issuer_id';
     * const claim = await claims.createPrivateClaim(claimData, didIssuer);
     * ```
     * @param {IClaimData } claimData
     * @param {string} didIssuer
     *
     * @return {Promise<IPrivateClaim>}
     */
    Claims.prototype.createPrivateClaim = function (claimData, didIssuer) {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jwt = new jwt_1.JWT(this._keyPair);
                        return [4 /*yield*/, jwt.sign(claimData)];
                    case 1:
                        token = _a.sent();
                        return [2 /*return*/, new private_1.PrivateClaim({
                                jwt: jwt,
                                keyPair: this._keyPair,
                                token: token,
                                issuerDid: didIssuer,
                            })];
                }
            });
        });
    };
    /**
     * Creates claim with verifiable data in hashedFields
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const claims = new Claims(keys);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:my_id',
     *     data: 'secret data'
     * };
     * const hashedFields = [123, 456];
     * const claim = await claims.createProofClaim(claimData, hashedFields);
     * ```
     * @param {IClaimData } claimData
     * @param {number[]} hashedFields
     *
     * @return {Promise<IPrivateClaim>}
     */
    // eslint-disable-next-line max-len
    Claims.prototype.createProofClaim = function (claimData, hashedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jwt = new jwt_1.JWT(this._keyPair);
                        return [4 /*yield*/, jwt.sign(claimData)];
                    case 1:
                        token = _a.sent();
                        return [2 /*return*/, new proof_1.ProofClaim({
                                jwt: jwt,
                                keyPair: this._keyPair,
                                token: token,
                                hashedFields: hashedFields,
                            })];
                }
            });
        });
    };
    /**
     * Creates claim of the specified type from the serialized claim
     *
     * @example
     * ```typescript
     * import { Claims, ClaimType } from '@ew-did-registry/claims';
     *
     * const keys = new Keys();
     * const claims = new Claims(keys);
     * const claim = claims.generateClaimFromToken(
     * ```
     *
     * @param { string } token
     * @param { ClaimType } type
     *
     * @return Promise<IVerificationClaim | IPrivateClaim | IProofClaim>
     */
    Claims.prototype.generateClaimFromToken = function (token, type) {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, _a, claimData, hashedFields, didIssuer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        jwt = new jwt_1.JWT(this._keyPair);
                        return [4 /*yield*/, jwt.decode(token)];
                    case 1:
                        _a = _b.sent(), claimData = _a.claimData, hashedFields = _a.hashedFields, didIssuer = _a.didIssuer;
                        switch (type) {
                            case models_1.ClaimType.Public:
                                return [2 /*return*/, this.createPublicClaim(claimData)];
                            case models_1.ClaimType.Private:
                                return [2 /*return*/, this.createPrivateClaim(claimData, hashedFields)];
                            case models_1.ClaimType.Proof:
                                return [2 /*return*/, this.createProofClaim(claimData, didIssuer)];
                            default:
                                return [2 /*return*/, this.createPublicClaim(claimData)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Claims;
}());
exports.Claims = Claims;
//# sourceMappingURL=claims.js.map