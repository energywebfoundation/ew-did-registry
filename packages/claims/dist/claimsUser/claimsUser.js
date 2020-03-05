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
/* eslint-disable max-len */
var crypto_1 = __importDefault(require("crypto"));
var eciesjs_1 = require("eciesjs");
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
var sjcl_complete_1 = __importDefault(require("sjcl-complete"));
var assert_1 = __importDefault(require("assert"));
var claims_1 = require("../claims");
var bn = sjcl_complete_1.default.bn, hash = sjcl_complete_1.default.hash, bitArray = sjcl_complete_1.default.bitArray;
var ClaimsUser = /** @class */ (function (_super) {
    __extends(ClaimsUser, _super);
    function ClaimsUser() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.curve = sjcl_complete_1.default.ecc.curves.k256;
        _this.q = _this.curve.r;
        _this.g = _this.curve.G;
        _this.paranoia = 6;
        return _this;
    }
    /**
     *
     * Creates token with data about subject provided in claimData
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new ClaimsUser(user);
     * const claimData = {
     *     name: 'John'
     * };
     * const token = await claims.createPublicClaim(claimData);
     * ```
     * @param { IClaimData } publicData
     *
     * @returns { Promise<string> }
     */
    ClaimsUser.prototype.createPublicClaim = function (publicData) {
        return __awaiter(this, void 0, void 0, function () {
            var claim;
            return __generator(this, function (_a) {
                claim = {
                    did: this.did,
                    signer: this.did,
                    claimData: publicData,
                };
                return [2 /*return*/, this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true })];
            });
        });
    };
    /**
     * Used by the claim subject to create token with subject encrypted
     * private data which afterwards will be sent to the issuer. Salted private
     * fields will be saved in the `saltedFields` argument
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new ClaimsUser(user);
     * const claimData = {
     *     secret: '123'
     * };
     * const claim = await claims.createPrivateClaim(claimData, issuer);
     * ```
     * @param { IClaimData } publicData object with claim subject private data
     * @param { string } issuer DID
     *
     * @returns { Promise<{token: string, saltedFields:{ [key: string]: string }}> } token with private data encrypted by issuer key
     */
    ClaimsUser.prototype.createPrivateClaim = function (privateData, issuer) {
        return __awaiter(this, void 0, void 0, function () {
            var saltedFields, claim, issuerDocument, issuerPK, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        saltedFields = {};
                        claim = {
                            did: this.did,
                            signer: this.did,
                            claimData: privateData,
                        };
                        return [4 /*yield*/, this.getDocument(issuer)];
                    case 1:
                        issuerDocument = _a.sent();
                        issuerPK = issuerDocument
                            .publicKey
                            .find(function (pk) { return pk.type === 'Secp256k1veriKey'; })
                            .publicKeyHex;
                        Object.entries(privateData).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            var salt = crypto_1.default.randomBytes(32).toString('base64');
                            var saltedValue = value + salt;
                            var encryptedValue = eciesjs_1.encrypt(issuerPK, Buffer.from(saltedValue));
                            claim.claimData[key] = encryptedValue.toString('hex');
                            saltedFields[key] = saltedValue;
                        });
                        return [4 /*yield*/, this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true })];
                    case 2:
                        token = _a.sent();
                        return [2 /*return*/, { token: token, saltedFields: saltedFields }];
                }
            });
        });
    };
    /**
     * Used by the claim subject based on the salted values calculated
     * when creating private claim
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new ClaimsUser(user);
     * const claimUrl = 'http://example.com';
     * const saltedFields = {
     *    secret: '123abc'
     * };
     * const claim = await claims.createProofClaim(claimUrl, saltedFields);
     * ```
     * @param { string } claimUrl - url of previously saved token
     * @param { { [keys: string]: string } } saltedFields - salted private user data
     *
     * @returns { Promise<string> }
     */
    ClaimsUser.prototype.createProofClaim = function (claimUrl, proofData) {
        return __awaiter(this, void 0, void 0, function () {
            var claim;
            var _this = this;
            return __generator(this, function (_a) {
                claim = {
                    did: this.did,
                    signer: this.did,
                    claimUrl: claimUrl,
                    proofData: proofData,
                };
                Object.entries(proofData).forEach(function (_a) {
                    var key = _a[0], field = _a[1];
                    if (field.encrypted) {
                        var k = bn.random(_this.q, _this.paranoia);
                        var h = _this.g.mult(k);
                        var hashedField = crypto_1.default.createHash('sha256').update(field.value).digest('hex');
                        var a = new bn(hashedField);
                        var PK = _this.g.mult(a);
                        var c = bn.fromBits(hash.sha256.hash(_this.g.x.toBits()
                            .concat(h.toBits())
                            .concat(PK.toBits())));
                        var ca = c.mul(a).mod(_this.q);
                        var s = ca.add(k).mod(_this.q);
                        claim.proofData[key] = {
                            value: { h: h.toBits(), s: s.toBits() },
                            encrypted: true,
                        };
                    }
                    else {
                        claim.proofData[key] = {
                            value: field.value,
                            encrypted: false,
                        };
                    }
                });
                return [2 /*return*/, this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true })];
            });
        });
    };
    /**
     * Verifies token received from issuer
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new UserClaims(user);
     * const verified = await claims.verifyPublicToken(issuedToken);
     * ```
     * @param { string } token - issued token
     * @returns {Promise<void>}
     * @throws if the proof failed
     */
    ClaimsUser.prototype.verifyPublicClaim = function (token, verifyData) {
        return __awaiter(this, void 0, void 0, function () {
            var claim;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        claim = this.jwt.decode(token);
                        return [4 /*yield*/, this.verifySignature(token, claim.signer)];
                    case 1:
                        if (!(_a.sent())) {
                            throw new Error('Incorrect signature');
                        }
                        assert_1.default.deepEqual(claim.claimData, verifyData, 'Token payload doesn\'t match user data');
                        return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Verifies token with private data received from issuer
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new UserClaims(user);
     * const verified = await claims.verifyPrivateToken(issuedToken);
     * ```
     * @param { string } token - issued token
     * @returns {Promise<void>}
     * @throw if the proof failed
     */
    ClaimsUser.prototype.verifyPrivateClaim = function (token, saltedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var claim, _i, _a, _b, key, value, fieldHash, PK;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        claim = this.jwt.decode(token);
                        return [4 /*yield*/, this.verifySignature(token, claim.signer)];
                    case 1:
                        if (!(_c.sent())) {
                            throw new Error('Invalid signature');
                        }
                        // eslint-disable-next-line no-restricted-syntax
                        for (_i = 0, _a = Object.entries(saltedFields); _i < _a.length; _i++) {
                            _b = _a[_i], key = _b[0], value = _b[1];
                            fieldHash = crypto_1.default.createHash('sha256').update(value).digest('hex');
                            PK = this.g.mult(new bn(fieldHash));
                            if (!bitArray.equal(claim.claimData[key], PK.toBits())) {
                                throw new Error('Issued claim data doesn\'t match user data');
                            }
                        }
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return ClaimsUser;
}(claims_1.Claims));
exports.ClaimsUser = ClaimsUser;
//# sourceMappingURL=claimsUser.js.map