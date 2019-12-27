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
var DIDDocumentLite = /** @class */ (function () {
    /**
     * Constructor takes DID of interest and Resolver as inputs
     * @param {string} did
     * @param {Resolver} resolver
     */
    function DIDDocumentLite(did, resolver) {
        this.resolver = resolver;
        this.did = did;
    }
    /**
     * Method returns the attribute of interest. An optional type parameter can be provided for
     * attributes, which are objects
     *
     * @example
     * ```typescript
     * import { Resolver } from '@ew-did-registry/did-resolver';
     * import { DIDDocumentFactory } from '@ew-did-registry/did-document';
     *
     * const sampleDid = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
     * const resolver = new Resolver();
     * const didLiteDocument = DIDDocumentFactory.createLite(sampleDid, resolver);
     * const id = didDocumentLite.read('id');
     *
     * console.log(`DID of the fetched document is ${id}`);
     * ```
     *
     * @param {string} attribute
     * @param {string} type
     */
    DIDDocumentLite.prototype.read = function (attribute, type) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, PubAuthService, instance;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.resolver.read(this.did)];
                    case 1:
                        _a.didDocument = _b.sent();
                        if (type === undefined) {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                            // @ts-ignore
                            return [2 /*return*/, this.didDocument[attribute]];
                        }
                        PubAuthService = this.didDocument[attribute];
                        if (PubAuthService === undefined) {
                            return [2 /*return*/, PubAuthService];
                        }
                        instance = PubAuthService.find(function (member) { return member.type === type; });
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    return DIDDocumentLite;
}());
exports.DIDDocumentLite = DIDDocumentLite;
//# sourceMappingURL=index.js.map