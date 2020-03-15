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
var ethers_1 = require("ethers");
var did_document_1 = require("@ew-did-registry/did-document");
var jwt_1 = require("@ew-did-registry/jwt");
var did_1 = require("@ew-did-registry/did");
/**
 * @class
 * Base class for extending by other claims classes
 */
var Claims = /** @class */ (function () {
    /**
     * @constructor
     *
     * @param { IKeys } keys user key pair
     * @param { IResolver } resolver
     */
    function Claims(keys, resolver) {
        this.resolver = resolver;
        this.keys = keys;
        this.jwt = new jwt_1.JWT(keys);
        var address = new ethers_1.Wallet(keys.privateKey).address;
        this.did = "did:" + did_1.Networks.Ethereum + ":" + address;
    }
    /**
     * Fetches DID document of the corresponding DID
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { Claims } from '@ew-did-registry/claims';
     *
     * const user = new Keys();
     * const claims = new Claims(user);
     * const did = `did:${Networks.Ethereum}:user_id`;
     * const document = await claims.getDocument(did);
     * ```
     *
     * @returns {Promise<IDIDDocument>}
     */
    Claims.prototype.getDocument = function (did) {
        return __awaiter(this, void 0, void 0, function () {
            var documentFactory, didDocumentLite;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        documentFactory = new did_document_1.DIDDocumentFactory(did);
                        didDocumentLite = documentFactory.createLite(this.resolver);
                        return [4 /*yield*/, didDocumentLite.read(did)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, didDocumentLite.didDocument];
                }
            });
        });
    };
    /**
     * Verifies signers signature on received token
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { Claims } from '@ew-did-registry/claims';
     *
     * const user = new Keys();
     * const claims = new Claims(user);
     * const verified = claims.verifySignature(token, userDid);
     * ```
     *
     * @param { string } token token signature on which you want to check
     * @param { string } signer did of the signer
     */
    Claims.prototype.verifySignature = function (token, signer) {
        return __awaiter(this, void 0, void 0, function () {
            var signerDocument, issuerPublicKey, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getDocument(signer)];
                    case 1:
                        signerDocument = _a.sent();
                        issuerPublicKey = signerDocument
                            .publicKey
                            .find(function (pk) { return pk.type === 'Secp256k1veriKey'; })
                            .publicKeyHex;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.jwt.verify(token, issuerPublicKey.slice(2))];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    return Claims;
}());
exports.Claims = Claims;
//# sourceMappingURL=claims.js.map