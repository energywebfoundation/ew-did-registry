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
var utils_1 = require("ethers/utils");
var ethers_1 = require("ethers");
var models_1 = require("../models");
var constants_1 = require("../constants");
var functions_1 = require("../functions");
var Resolver = /** @class */ (function () {
    /**
     * Constructor
     *
     * Settings have to be passed to construct resolver
     * @param {IResolverSettings} settings
     */
    function Resolver(settings) {
        if (settings === void 0) { settings = constants_1.defaultResolverSettings; }
        this._settings = settings;
        if (settings.provider.type === models_1.ProviderTypes.HTTP) {
            this._providerResolver = new ethers_1.ethers.providers.JsonRpcProvider(settings.provider.uriOrInfo, settings.provider.network);
        }
        else if (settings.provider.type === models_1.ProviderTypes.IPC) {
            this._providerResolver = new ethers_1.ethers.providers.IpcProvider(settings.provider.path, settings.provider.network);
        }
        this._contract = new ethers_1.ethers.Contract(settings.address, settings.abi, this._providerResolver);
    }
    /**
     * Resolve DID Document for a given did
     *
     * @example
     * ```typescript
     * import { Resolver } from '@ew-did-registry/did-resolver';
     *
     * const resolver = new Resolver();
     * const didDocument = await resolver.read(did);
     * ```
     *
     * @param {string} did - entity identifier, which is associated with DID Document
     * @returns {Promise<IDIDDocument>}
     */
    Resolver.prototype.read = function (did) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(
                    // eslint-disable-next-line no-async-promise-executor
                    function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, address, _b, blockchainAddress, didDocument, error_1, didDocument;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = did.split(':'), address = _a[2];
                                    if (!constants_1.matchingPatternDid.test(did) || (address.length !== 42)) {
                                        reject(new Error('Invalid did provided'));
                                        return [2 /*return*/];
                                    }
                                    if (this._fetchedDocument === undefined || this._fetchedDocument.owner !== did) {
                                        _b = did.split(':'), blockchainAddress = _b[2];
                                        this._fetchedDocument = {
                                            owner: blockchainAddress,
                                            lastChangedBlock: new utils_1.BigNumber(0),
                                            authentication: {},
                                            publicKey: {},
                                            serviceEndpoints: {},
                                            attributes: new Map(),
                                        };
                                    }
                                    _c.label = 1;
                                case 1:
                                    _c.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, functions_1.fetchDataFromEvents(did, this._fetchedDocument, this._settings, this._contract, this._providerResolver)];
                                case 2:
                                    _c.sent();
                                    didDocument = functions_1.wrapDidDocument(did, this._fetchedDocument);
                                    resolve(didDocument);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _c.sent();
                                    if (error_1.toString() === 'Error: Blockchain address did not interact with smart contract') {
                                        didDocument = functions_1.wrapDidDocument(did, this._fetchedDocument);
                                        resolve(didDocument);
                                    }
                                    reject(error_1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    /**
     * Returns the Ethereum address of current identity owner
     *
     * @param { string } did - did of identity of interest
     * @returns Promise<string>
     */
    Resolver.prototype.identityOwner = function (did) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, owner, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = did.split(':'), id = _a[2];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._contract.identityOwner(id)];
                    case 2:
                        owner = _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_2 = _b.sent();
                        throw new Error(error_2);
                    case 4: return [2 /*return*/, owner];
                }
            });
        });
    };
    /**
     * Performs the check if the delegate is valid for particular did
     * Return boolean
     *
     * @param { string } identityDID - did of identity of interest
     * @param { DelegateTypes } delegateType - type of delegate of interest
     * @param { delegateDID } did - did of delegate of interest
     * @returns Promise<boolean>
     */
    Resolver.prototype.validDelegate = function (identityDID, delegateType, delegateDID) {
        return __awaiter(this, void 0, void 0, function () {
            var bytesType, _a, identityAddress, _b, delegateAddress, valid, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        bytesType = ethers_1.ethers.utils.formatBytes32String(delegateType);
                        _a = identityDID.split(':'), identityAddress = _a[2];
                        _b = delegateDID.split(':'), delegateAddress = _b[2];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this._contract.validDelegate(identityAddress, bytesType, delegateAddress)];
                    case 2:
                        valid = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_3 = _c.sent();
                        throw new Error(error_3);
                    case 4: return [2 /*return*/, valid];
                }
            });
        });
    };
    return Resolver;
}());
exports.default = Resolver;
//# sourceMappingURL=resolver.js.map