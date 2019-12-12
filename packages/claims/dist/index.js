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
// import { IDidDocument } from '@ew-did-registry/did-resolver';
var jwt_1 = require("@ew-did-registry/jwt");
var private_1 = require("./private");
var models_1 = require("./models");
var proof_1 = require("./proof");
var public_1 = require("./public");
var Claims = /** @class */ (function () {
    function Claims(keyPair /*, didDocument: IDidDocument*/) {
        this._keyPair = keyPair;
        // this._didDocument = didDocument;
    }
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
    Claims.prototype.generateClaimFromToken = function (token, type) {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, _a, claimData, hashedFields, didIssuer, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        jwt = new jwt_1.JWT(this._keyPair);
                        return [4 /*yield*/, jwt.verify(token, this._keyPair.publicKey)];
                    case 1:
                        _a = _c.sent(), claimData = _a.claimData, hashedFields = _a.hashedFields, didIssuer = _a.didIssuer;
                        _b = type;
                        switch (_b) {
                            case models_1.ClaimType.Public: return [3 /*break*/, 2];
                            case models_1.ClaimType.Private: return [3 /*break*/, 4];
                            case models_1.ClaimType.Proof: return [3 /*break*/, 6];
                        }
                        return [3 /*break*/, 8];
                    case 2: return [4 /*yield*/, this.createPublicClaim(claimData)];
                    case 3: return [2 /*return*/, _c.sent()];
                    case 4: return [4 /*yield*/, this.createPrivateClaim(claimData, hashedFields)];
                    case 5: return [2 /*return*/, _c.sent()];
                    case 6: return [4 /*yield*/, this.createProofClaim(claimData, didIssuer)];
                    case 7: return [2 /*return*/, _c.sent()];
                    case 8: return [4 /*yield*/, this.createPublicClaim(claimData)];
                    case 9: return [2 /*return*/, _c.sent()];
                }
            });
        });
    };
    return Claims;
}());
exports.Claims = Claims;
//# sourceMappingURL=index.js.map