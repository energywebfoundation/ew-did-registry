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
/* eslint-disable no-await-in-loop,no-restricted-syntax */
var ethers_1 = require("ethers");
var models_1 = require("../models");
var resolver_1 = __importDefault(require("./resolver"));
var constants_1 = require("../constants");
var Authenticate = models_1.DIDAttribute.Authenticate, PublicKey = models_1.DIDAttribute.PublicKey, ServicePoint = models_1.DIDAttribute.ServicePoint;
var Operator = /** @class */ (function (_super) {
    __extends(Operator, _super);
    /**
     *
     * @param { IKeys } keys - identifies an account which acts as a
     * controller in a subsequent operations with DID document
     */
    function Operator(keys, settings) {
        if (settings === void 0) { settings = constants_1.defaultResolverSettings; }
        var _this = _super.call(this, settings) || this;
        _this._keys = keys;
        var _a = _this._settings, address = _a.address, abi = _a.abi;
        var privateKey = _this._keys.privateKey;
        _this._provider = _this._getProvider();
        var wallet = new ethers_1.ethers.Wallet(privateKey, _this._provider);
        _this._wallet = wallet;
        _this._didRegistry = new ethers_1.ethers.Contract(address, abi, wallet);
        return _this;
    }
    /**
     * Empty for this implementation
     *
     * @param did
     * @param context
     * @returns Promise<boolean>
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Operator.prototype.create = function (did, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Promise.resolve(true)];
            });
        });
    };
    /**
     * Sets attribute value in DID document identified by the did
     *
     * @example
     *```typescript
     * import {
     * Operator, DIDAttribute, Algorithms, PubKeyType, Encoding
     *  } from '@ew-did-registry/did-resolver';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const ownerKeys = new Keys();
     * const operator = new Operator(ownerKeys);
     * const pKey = DIDAttribute.PublicKey;
     * const updateData = {
     *     algo: Algorithms.ED25519,
     *     type: PubKeyType.VerificationKey2018,
     *     encoding: Encoding.HEX,
     *     value: new Keys().publicKey,
     * };
     * const validity = 10 * 60 * 1000;
     * const updated = await operator.update(did, pKey, updateData, validity);
     * ```
     *
     * @param { string } did - did associated with DID document
     * @param { DIDAttribute } didAttribute - specifies updated section in DID document. Must be 31
     * bytes or shorter
     * @param { IUpdateData } updateData
     * @param { number } validity - time in milliseconds during which
     *                              attribute will be valid
     * @returns Promise<boolean>
     */
    Operator.prototype.update = function (did, didAttribute, updateData, validity) {
        if (validity === void 0) { validity = ethers_1.ethers.constants.MaxUint256; }
        return __awaiter(this, void 0, void 0, function () {
            var registry, method;
            return __generator(this, function (_a) {
                registry = this._didRegistry;
                method = didAttribute === PublicKey || didAttribute === ServicePoint
                    ? registry.setAttribute
                    : registry.addDelegate;
                return [2 /*return*/, this._sendTransaction(method, did, didAttribute, updateData, validity)];
            });
        });
    };
    Operator.prototype.revokeDelegate = function (identityDID, delegateType, delegateDID) {
        return __awaiter(this, void 0, void 0, function () {
            var bytesType, _a, identityAddress, _b, delegateAddress, tx, receipt, event_1, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        bytesType = ethers_1.ethers.utils.formatBytes32String(delegateType);
                        _a = identityDID.split(':'), identityAddress = _a[2];
                        _b = delegateDID.split(':'), delegateAddress = _b[2];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this._didRegistry.revokeDelegate(identityAddress, bytesType, delegateAddress)];
                    case 2:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        receipt = _c.sent();
                        event_1 = receipt.events.find(function (e) { return (e.event === 'DIDDelegateChanged'); });
                        if (!event_1)
                            return [2 /*return*/, false];
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _c.sent();
                        throw new Error(error_1);
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    Operator.prototype.revokeAttribute = function (identityDID, attributeType, delegateDID) {
        return __awaiter(this, void 0, void 0, function () {
            var bytesType, _a, identityAddress, _b, delegateAddress, tx, receipt, event_2, error_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        bytesType = ethers_1.ethers.utils.formatBytes32String(attributeType);
                        _a = identityDID.split(':'), identityAddress = _a[2];
                        _b = delegateDID.split(':'), delegateAddress = _b[2];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this._didRegistry.revokeAttribute(identityAddress, bytesType, delegateAddress)];
                    case 2:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        receipt = _c.sent();
                        event_2 = receipt.events.find(function (e) { return (e.event === 'DIDAttributeChanged'); });
                        if (!event_2)
                            return [2 /*return*/, false];
                        return [3 /*break*/, 5];
                    case 4:
                        error_2 = _c.sent();
                        throw new Error(error_2);
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    Operator.prototype.changeOwner = function (identityDID, newOwnerDid) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, identityAddress, _b, delegateAddress, tx, receipt, event_3, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = identityDID.split(':'), identityAddress = _a[2];
                        _b = newOwnerDid.split(':'), delegateAddress = _b[2];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this._didRegistry.changeOwner(identityAddress, delegateAddress)];
                    case 2:
                        tx = _c.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        receipt = _c.sent();
                        event_3 = receipt.events.find(function (e) { return (e.event === 'DIDOwnerChanged'); });
                        if (!event_3)
                            return [2 /*return*/, false];
                        return [3 /*break*/, 5];
                    case 4:
                        error_3 = _c.sent();
                        throw new Error(error_3);
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    /**
     * Revokes authentication methods, public keys and delegates from DID document
     *
     * @example
     * ```typescript
     *import { Operator } from '@ew-did-registry/did-resolver';
     *import { Keys } from '@ew-did-registry/keys';
     *
     * const ownerKeys = new Keys();
     * const operator = new Operator(ownerKeys);
     * const updated = await operator.deactivate(did);
     * ```
     *
     * @param { string } did
     * @returns Promise<boolean>
     */
    Operator.prototype.deactivate = function (did) {
        return __awaiter(this, void 0, void 0, function () {
            var document, authRevoked, pubKeysRevoked, endpointsRevoked;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.read(did)];
                    case 1:
                        document = _a.sent();
                        return [4 /*yield*/, this._revokeAuthentications(did, document.authentication, document.publicKey)];
                    case 2:
                        authRevoked = _a.sent();
                        return [4 /*yield*/, this._revokePublicKeys(did, document.publicKey)];
                    case 3:
                        pubKeysRevoked = _a.sent();
                        return [4 /*yield*/, this._revokeServices(did, document.service)];
                    case 4:
                        endpointsRevoked = _a.sent();
                        return [2 /*return*/, authRevoked && pubKeysRevoked && endpointsRevoked];
                }
            });
        });
    };
    Operator.prototype._revokeAuthentications = function (did, auths, publicKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var sender, nonce, method, _loop_1, this_1, _i, publicKeys_1, pk, state_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sender = this._wallet.address;
                        return [4 /*yield*/, this._didRegistry.provider.getTransactionCount(sender)];
                    case 1:
                        nonce = _a.sent();
                        method = this._didRegistry.revokeDelegate;
                        _loop_1 = function (pk) {
                            var match, didAttribute, delegateAddress, updateData, revoked;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        match = pk.id.match(constants_1.delegatePubKeyIdPattern);
                                        // eslint-disable-next-line no-continue
                                        if (!match)
                                            return [2 /*return*/, "continue"];
                                        didAttribute = Authenticate;
                                        delegateAddress = pk.ethereumAddress;
                                        updateData = {
                                            algo: models_1.Algorithms.ED25519,
                                            type: auths.find(function (auth) { return auth.publicKey === match[0]; }) ? models_1.PubKeyType.SignatureAuthentication2018
                                                : models_1.PubKeyType.VerificationKey2018,
                                            encoding: models_1.Encoding.HEX,
                                            delegate: delegateAddress,
                                        };
                                        return [4 /*yield*/, this_1._sendTransaction(method, did, didAttribute, updateData, null, { nonce: nonce })];
                                    case 1:
                                        revoked = _a.sent();
                                        if (!revoked) {
                                            return [2 /*return*/, { value: false }];
                                        }
                                        nonce += 1;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        _i = 0, publicKeys_1 = publicKeys;
                        _a.label = 2;
                    case 2:
                        if (!(_i < publicKeys_1.length)) return [3 /*break*/, 5];
                        pk = publicKeys_1[_i];
                        return [5 /*yield**/, _loop_1(pk)];
                    case 3:
                        state_1 = _a.sent();
                        if (typeof state_1 === "object")
                            return [2 /*return*/, state_1.value];
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    Operator.prototype._revokePublicKeys = function (did, publicKeys) {
        return __awaiter(this, void 0, void 0, function () {
            var sender, nonce, _loop_2, this_2, _i, publicKeys_2, pk, state_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sender = this._wallet.address;
                        return [4 /*yield*/, this._didRegistry.provider.getTransactionCount(sender)];
                    case 1:
                        nonce = _a.sent();
                        _loop_2 = function (pk) {
                            var match, didAttribute, encodings, encoding, value, updateData, method, revoked;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        match = pk.id.match(constants_1.pubKeyIdPattern);
                                        // eslint-disable-next-line no-continue
                                        if (!match)
                                            return [2 /*return*/, "continue"];
                                        didAttribute = models_1.DIDAttribute.PublicKey;
                                        encodings = Object.values(models_1.Encoding);
                                        encoding = encodings.find(function (e) {
                                            var suffix = "" + e[0].toUpperCase() + e.slice(1);
                                            return pk["publicKey" + suffix];
                                        });
                                        if (!encoding) {
                                            throw new Error('Unknown encoding');
                                        }
                                        value = pk["publicKey" + encoding[0].toUpperCase() + encoding.slice(1)];
                                        updateData = {
                                            algo: models_1.Algorithms.ED25519,
                                            type: match[1],
                                            encoding: encoding,
                                            value: value,
                                        };
                                        method = this_2._didRegistry.revokeAttribute;
                                        return [4 /*yield*/, this_2._sendTransaction(method, did, didAttribute, updateData, null, { nonce: nonce })];
                                    case 1:
                                        revoked = _a.sent();
                                        if (!revoked) {
                                            return [2 /*return*/, { value: false }];
                                        }
                                        nonce += 1;
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_2 = this;
                        _i = 0, publicKeys_2 = publicKeys;
                        _a.label = 2;
                    case 2:
                        if (!(_i < publicKeys_2.length)) return [3 /*break*/, 5];
                        pk = publicKeys_2[_i];
                        return [5 /*yield**/, _loop_2(pk)];
                    case 3:
                        state_2 = _a.sent();
                        if (typeof state_2 === "object")
                            return [2 /*return*/, state_2.value];
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    Operator.prototype._revokeServices = function (did, services) {
        return __awaiter(this, void 0, void 0, function () {
            var revoked, sender, nonce, _i, services_1, service, match, algo, value, didAttribute, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        revoked = true;
                        sender = this._wallet.address;
                        return [4 /*yield*/, this._didRegistry.provider.getTransactionCount(sender)];
                    case 1:
                        nonce = _b.sent();
                        _i = 0, services_1 = services;
                        _b.label = 2;
                    case 2:
                        if (!(_i < services_1.length)) return [3 /*break*/, 6];
                        service = services_1[_i];
                        match = service.id.match(constants_1.serviceIdPattern);
                        algo = match[1];
                        value = service.serviceEndpoint;
                        didAttribute = models_1.DIDAttribute.ServicePoint;
                        _a = revoked;
                        if (!_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this._sendTransaction(this._didRegistry.revokeAttribute, did, didAttribute, {
                                algo: algo, type: models_1.PubKeyType.VerificationKey2018, encoding: models_1.Encoding.HEX, value: value,
                            }, null, { nonce: nonce })];
                    case 3:
                        _a = (_b.sent());
                        _b.label = 4;
                    case 4:
                        revoked = _a;
                        nonce += nonce;
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 2];
                    case 6: return [2 /*return*/, revoked];
                }
            });
        });
    };
    Operator.prototype._sendTransaction = function (method, did, didAttribute, updateData, validity, overrides) {
        return __awaiter(this, void 0, void 0, function () {
            var identity, attributeName, bytesOfAttribute, bytesOfValue, argums, tx, receipt, event_4, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (validity && validity < 0) {
                            throw new Error('Validity must be non negative value');
                        }
                        identity = Operator._parseDid(did);
                        attributeName = this._composeAttributeName(didAttribute, updateData);
                        bytesOfAttribute = ethers_1.ethers.utils.formatBytes32String(attributeName);
                        bytesOfValue = this._hexify(didAttribute === PublicKey || didAttribute === ServicePoint
                            ? updateData.value
                            : updateData.delegate);
                        argums = [identity,
                            bytesOfAttribute,
                            bytesOfValue,
                            validity || overrides,
                            validity && overrides,
                        ];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, method.apply(void 0, argums.filter(function (a) { return a; }))];
                    case 2:
                        tx = _a.sent();
                        return [4 /*yield*/, tx.wait()];
                    case 3:
                        receipt = _a.sent();
                        event_4 = receipt.events.find(function (e) { return (didAttribute === models_1.DIDAttribute.PublicKey && e.event === 'DIDAttributeChanged')
                            || (didAttribute === models_1.DIDAttribute.ServicePoint && e.event === 'DIDAttributeChanged')
                            || (didAttribute === models_1.DIDAttribute.Authenticate && e.event === 'DIDDelegateChanged'); });
                        if (!event_4)
                            return [2 /*return*/, false];
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/, true];
                }
            });
        });
    };
    Operator.prototype._composeAttributeName = function (attribute, updateData) {
        var algo = updateData.algo, type = updateData.type, encoding = updateData.encoding;
        switch (attribute) {
            case models_1.DIDAttribute.PublicKey:
                return "did/" + models_1.DIDAttribute.PublicKey + "/" + algo + "/" + type + "/" + encoding;
            case models_1.DIDAttribute.Authenticate:
                return updateData.type;
            case models_1.DIDAttribute.ServicePoint:
                return "did/" + models_1.DIDAttribute.ServicePoint + "/" + algo + "/" + type + "/" + encoding;
            default:
                throw new Error('Unknown attribute name');
        }
    };
    Operator.prototype._hexify = function (value) {
        if (typeof value === 'string' && value.startsWith('0x')) {
            return value;
        }
        return "0x" + Buffer.from(typeof value === 'string'
            ? value
            : JSON.stringify(value))
            .toString('hex');
    };
    Operator.prototype._getProvider = function () {
        var provider = this._settings.provider;
        switch (provider.type) {
            case models_1.ProviderTypes.HTTP:
                return new ethers_1.ethers.providers.JsonRpcProvider(provider.uriOrInfo, provider.network);
            case models_1.ProviderTypes.IPC:
                return new ethers_1.ethers.providers.IpcProvider(provider.path, provider.network);
            default:
                return ethers_1.ethers.getDefaultProvider();
        }
    };
    Operator._parseDid = function (did) {
        if (!constants_1.matchingPatternDid.test(did)) {
            throw new Error('Invalid DID');
        }
        var _a = did.split(':'), id = _a[2];
        return id;
    };
    return Operator;
}(resolver_1.default));
exports.Operator = Operator;
//# sourceMappingURL=operator.js.map