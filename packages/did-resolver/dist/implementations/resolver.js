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
     */
    Resolver.prototype.read = function (did) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(
                    // eslint-disable-next-line no-async-promise-executor
                    function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var didDocument, error_1, didDocument;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!constants_1.matchingPatternDid.test(did)) {
                                        reject(new Error('Invalid did provided'));
                                        return [2 /*return*/];
                                    }
                                    if (this._fetchedDocument === undefined) {
                                        this._fetchedDocument = {
                                            owner: undefined,
                                            lastChangedBlock: new utils_1.BigNumber(0),
                                            authentication: {},
                                            publicKey: {},
                                            serviceEndpoints: {},
                                            attributes: new Map(),
                                        };
                                    }
                                    _a.label = 1;
                                case 1:
                                    _a.trys.push([1, 3, , 4]);
                                    return [4 /*yield*/, functions_1.fetchDataFromEvents(did, this._fetchedDocument, this._settings)];
                                case 2:
                                    _a.sent();
                                    didDocument = functions_1.wrapDidDocument(did, this._fetchedDocument);
                                    resolve(didDocument);
                                    return [3 /*break*/, 4];
                                case 3:
                                    error_1 = _a.sent();
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
    return Resolver;
}());
exports.default = Resolver;
//# sourceMappingURL=resolver.js.map