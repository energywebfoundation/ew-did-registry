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
var did_document_1 = require("@ew-did-registry/did-document");
var did_resolver_1 = require("@ew-did-registry/did-resolver");
var keys_1 = require("@ew-did-registry/keys");
var public_1 = require("../public");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var ecies = require('eciesjs');
var PrivateClaim = /** @class */ (function (_super) {
    __extends(PrivateClaim, _super);
    /**
     * Constructor takes as input Private Claim data.
     * eslint warning disabled to ensure type-checking.
     * @param data
     */
    // eslint-disable-next-line no-useless-constructor
    function PrivateClaim(data) {
        var _this = _super.call(this, data) || this;
        if (data.token === undefined) {
            _this.issuerDid = data.claimData.issuerDid;
        }
        _this.resolverSettings = data.resolverSettings;
        return _this;
    }
    PrivateClaim.prototype.createPrivateClaimData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var issuerDocumentLite, resolver, documentFactory, error_1, issuerPublicKey, issuerEthereumPublic, privateClaimData, saltedFields;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        resolver = new did_resolver_1.Resolver(this.resolverSettings);
                        documentFactory = new did_document_1.DIDDocumentFactory(this.issuerDid);
                        issuerDocumentLite = documentFactory.createLite(resolver);
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
                        privateClaimData = {
                            did: this.claimData.did,
                        };
                        saltedFields = {};
                        Object.entries(this.claimData).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            var salt = crypto_1.default.randomBytes(32).toString('base64');
                            var saltedValue = value + salt;
                            var encrpytedSaltedValue;
                            try {
                                encrpytedSaltedValue = ecies.encrypt(issuerEthereumPublic, Buffer.from(saltedValue));
                            }
                            catch (error) {
                                throw new Error(error);
                            }
                            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                            // @ts-ignore
                            privateClaimData[key] = encrpytedSaltedValue;
                            saltedFields[key] = saltedValue;
                        });
                        this.claimData = privateClaimData;
                        return [2 /*return*/, saltedFields];
                }
            });
        });
    };
    PrivateClaim.prototype.decryptAndHashFields = function (privateKey) {
        if (privateKey.length === 32) {
            privateKey = "0x" + privateKey;
        }
        var privateClaimData = {
            did: this.issuerDid,
        };
        Object.entries(this.claimData).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (key !== 'did') {
                var decryptedField = ecies.decrypt(privateKey, value).toString();
                var fieldHash = crypto_1.default.createHash('sha256').update(decryptedField).digest('hex');
                var fieldKeys = new keys_1.Keys({ privateKey: fieldHash, publicKey: undefined });
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                privateClaimData[key] = fieldKeys.publicKey;
            }
        });
        this.claimData = privateClaimData;
    };
    PrivateClaim.prototype.verifyPayload = function (saltedFields) {
        var _this = this;
        Object.entries(saltedFields).forEach(
        // eslint-disable-next-line consistent-return
        function (_a) {
            var key = _a[0], value = _a[1];
            if (key !== 'did') {
                var fieldHash = crypto_1.default.createHash('sha256').update(value).digest('hex');
                var fieldKeys = new keys_1.Keys({ privateKey: fieldHash, publicKey: undefined });
                if (_this.claimData[key] !== fieldKeys.publicKey) {
                    return false;
                }
            }
        });
        return true;
    };
    return PrivateClaim;
}(public_1.VerificationClaim));
exports.PrivateClaim = PrivateClaim;
//# sourceMappingURL=index.js.map