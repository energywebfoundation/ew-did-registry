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
var crypto_1 = __importDefault(require("crypto"));
var eciesjs_1 = require("eciesjs");
var did_document_1 = require("@ew-did-registry/did-document");
var keys_1 = require("@ew-did-registry/keys");
var public_1 = require("../public");
var PrivateClaim = /** @class */ (function (_super) {
    __extends(PrivateClaim, _super);
    /**
     * Constructor takes as input Private Claim data.
     * eslint warning disabled to ensure type-checking.
     * @param data
     */
    function PrivateClaim(data) {
        var _this = _super.call(this, data) || this;
        if (data.token === undefined) {
            _this.issuerDid = data.claimData.issuerDid;
        }
        return _this;
    }
    /**
     * Creation of Private Claim is a separate method to avoid asynchronous calls in the constructor
     *
     * @example
     * ```typescript
     * import { PrivateClaim } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * const keys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     *  did: `did:ewc:0x${keys.publicKey}`,
     *  issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
     *  test: 'test',
     * };
     *
     * const data = {
     *  jwt,
     *  keyPair: keys,
     *  claimData,
     * };
     * const privateClaim = new PrivateClaim(data);
     * await privateClaim.createPrivateClaimData();
     * console.log(privateClaim);
     * ```
     * @returns {Promise<{ [key: string]: string }}
     */
    PrivateClaim.prototype.createPrivateClaimData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var issuerDocumentLite, documentFactory, error_1, issuerPublicKey, issuerEthereumPublic, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        documentFactory = new did_document_1.DIDDocumentFactory(this.issuerDid);
                        issuerDocumentLite = documentFactory.createLite(this.resolver);
                        return [4 /*yield*/, issuerDocumentLite.read('did')];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 3:
                        issuerPublicKey = issuerDocumentLite.didDocument.publicKey.find(function (pk) { return pk.type === 'Secp256k1VerificationKey'; });
                        issuerEthereumPublic = issuerPublicKey.ethereumAddress;
                        results = Object.entries(this.claimData).reduce(function (accumulator, currentValue) {
                            var key = currentValue[0], value = currentValue[1];
                            if (key !== 'did') {
                                var salt = crypto_1.default.randomBytes(32).toString('base64');
                                var saltedValue = value + salt;
                                var encrpytedSaltedValue = void 0;
                                try {
                                    encrpytedSaltedValue = eciesjs_1.encrypt(issuerEthereumPublic, Buffer.from(saltedValue));
                                }
                                catch (error) {
                                    throw new Error(error);
                                }
                                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                                // @ts-ignore
                                accumulator.privateClaimData[key] = encrpytedSaltedValue;
                                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                                // @ts-ignore
                                accumulator.saltedFields[key] = saltedValue;
                            }
                            return accumulator;
                        }, { privateClaimData: { did: this.claimData.did }, saltedFields: {} });
                        this.claimData = results.privateClaimData;
                        return [2 /*return*/, results.saltedFields];
                }
            });
        });
    };
    /**
     * This method is called when the issuer receives the token from the user with encrypted data
     *
     * @example
     * ```typescript
     * import { PrivateClaim } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * const keys = new Keys();
     * const issuerKeys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     * did: `did:ewc:0x${keys.publicKey}`,
     * issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
     *  test: 'test',
     * };
     * const data = {
     *  jwt,
     *  keyPair: keys,
     *  claimData,
     * };
     * const privateClaim = new PrivateClaim(data);
     * await privateClaim.createPrivateClaimData();
     *
     * const issuerJWT = new JWT(issuerKeys);
     * const issuerData = {
     *  jwt: issuerJWT,
     *  keyPair: issuerKeys,
     *  token: privateClaim.token,
     * }
     * const privateClaimIssuer = new PrivateClaim(issuerData);
     * privateClaimIssuer.decryptAndHashFields();
     * const hashedFields = privateClaimIssuer.claimData;
     * console.log(hashedFields);
     * ```
     *
     * @returns void
     */
    PrivateClaim.prototype.decryptAndHashFields = function () {
        var privateKeyIssuer = this.keyPair.privateKey;
        if (privateKeyIssuer.length === 32) {
            privateKeyIssuer = "0x" + privateKeyIssuer;
        }
        this.claimData = Object.entries(this.claimData).reduce(function (accumulator, currentValue) {
            var key = currentValue[0], value = currentValue[1];
            if (key !== 'did' && key !== 'signerDid') {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                var decryptedField = eciesjs_1.decrypt(privateKeyIssuer, Buffer.from(value.data));
                var fieldHash = crypto_1.default.createHash('sha256').update(decryptedField.toString()).digest('hex');
                var fieldKeys = new keys_1.Keys({ privateKey: fieldHash });
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                accumulator[key] = fieldKeys.publicKey;
            }
            return accumulator;
        }, { did: this.claimData.did });
    };
    /**
     * This method is called by the user after the issuer returns signed JWT with hashed
     * encrypted fields. Methods verifies if the payload was created correctly
     *
     * @example
     * ```typescript
     * import { PrivateClaim } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * const keys = new Keys();
     * const issuerKeys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     * did: `did:ewc:0x${keys.publicKey}`,
     * issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
     *  test: 'test',
     * };
     * const data = {
     *  jwt,
     *  keyPair: keys,
     *  claimData,
     * };
     * const privateClaim = new PrivateClaim(data);
     * const saltedFields = await privateClaim.createPrivateClaimData();
     * privateClaim.decryptAndHashFields(issuerKeys.privateKey);
     * const issuerSignedToken = await issuerJWT.sign(privateClaim.claimData,
     * { algorithm: 'ES256', noTimestamp: true });
     * const issuerClaimData = {
     *  did: `did:ewc:0x${issuerKeys.publicKey}`,
     * };
     * const issuerData = {
     *  jwt,
     *  keyPair: keys,
     *  token: issuerSignedToken,
     *  claimData: issuerClaimData,
     * }
     * const issuerReturnedPrivateClaim = new PrivateClaim(issuerData);
     * issuerReturnedPrivateClaim.verify();
     * const verified = issuerReturnedPrivateClaim.verifyPayload(saltedFields);
     * console.log(verified);
     * ```
     *
     * @param {IClaimFields} saltedFields
     * @returns boolean
     */
    PrivateClaim.prototype.verifyPayload = function (saltedFields) {
        // eslint-disable-next-line no-restricted-syntax
        for (var _i = 0, _a = Object.keys(saltedFields); _i < _a.length; _i++) {
            var key = _a[_i];
            var value = saltedFields[key];
            if (key !== 'did') {
                var fieldHash = crypto_1.default.createHash('sha256').update(value).digest('hex');
                var fieldKeys = new keys_1.Keys({ privateKey: fieldHash });
                if (this.claimData[key] !== fieldKeys.publicKey) {
                    return false;
                }
            }
        }
        return true;
    };
    return PrivateClaim;
}(public_1.VerificationClaim));
exports.PrivateClaim = PrivateClaim;
//# sourceMappingURL=index.js.map