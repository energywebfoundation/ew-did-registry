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
var did_document_1 = require("@ew-did-registry/did-document");
var Claim = /** @class */ (function () {
    /**
     * Constructor
     *
     * IClaimBuildData has to be passed to construct any type of Claim
     * @param {IClaimBuildData} data
     */
    function Claim(data) {
        this.resolver = data.resolver;
        this.keyPair = data.keyPair;
        this.jwt = new jwt_1.JWT(data.keyPair);
        if (data.token === undefined) {
            var documentFactory = new did_document_1.DIDDocumentFactory(data.claimData.did);
            this.didDocumentLite = documentFactory.createLite(this.resolver);
            this.claimData = data.claimData;
        }
        else {
            this.token = data.token;
            var decodedPayload = this.jwt.decode(this.token);
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            if (decodedPayload.did) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                var decodedDid = decodedPayload.did;
                var documentFactory = new did_document_1.DIDDocumentFactory(decodedDid);
                this.didDocumentLite = documentFactory.createLite(this.resolver);
                this.claimData = decodedPayload;
                this.claimData.signerDid = data.signerDid;
            }
        }
    }
    /**
     * Method fetches the DID Document associated with did provided in claim data
     * DID Document is then stored as a member of Claim class. Returns true on success
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * import { Claim } from '@ew-did-registry/claims';
     *
     * const keys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     *   did: `did:ewc:0x${keys.publicKey}`,
     *   test: 'test',
     * };
     * const data = {
     *   jwt,
     *   keyPair: keys,
     *   claimData,
     * };
     * const publicClaim = new Claim(data);
     * await publicClaim.getDid();
     * console.log(publicClaim.didDocument);
     * ```
     *
     * @returns {Promise<boolean>}
     */
    Claim.prototype.getDid = function (did) {
        return __awaiter(this, void 0, void 0, function () {
            var documentFactory, tempDidDocumentLite, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        if (!did) return [3 /*break*/, 2];
                        documentFactory = new did_document_1.DIDDocumentFactory(did);
                        tempDidDocumentLite = documentFactory.createLite(this.resolver);
                        return [4 /*yield*/, tempDidDocumentLite.read(did)];
                    case 1:
                        _a.sent();
                        this.didDocument = tempDidDocumentLite.didDocument;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.didDocumentLite.read(this.claimData.did)];
                    case 3:
                        _a.sent();
                        this.didDocument = this.didDocumentLite.didDocument;
                        _a.label = 4;
                    case 4: return [2 /*return*/, true];
                    case 5:
                        error_1 = _a.sent();
                        throw new Error(error_1);
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Method creates token with the payload provided in the claim data
     * The signed token is stored as a member of Claim class
     * This is a void method
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * import { Claim } from '@ew-did-registry/claims';
     *
     * const keys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     *   did: `did:ewc:0x${keys.publicKey}`,
     *   test: 'test',
     * };
     * const data = {
     *   jwt,
     *   keyPair: keys,
     *   claimData,
     * };
     * const publicClaim = new Claim(data);
     * await publicClaim.createJWT();
     * console.log(publicClaim.token);
     * ```
     */
    Claim.prototype.createJWT = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.jwt.sign(this.claimData, { algorithm: 'ES256', noTimestamp: true })];
                    case 1:
                        _a.token = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Claim;
}());
exports.default = Claim;
//# sourceMappingURL=claim.js.map