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
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
var sjcl_complete_1 = __importDefault(require("sjcl-complete"));
// const sjcl = require('sjcl-complete');
var public_1 = require("../public");
var bn = sjcl_complete_1.default.bn, hash = sjcl_complete_1.default.hash, codec = sjcl_complete_1.default.codec;
var ProofClaim = /** @class */ (function (_super) {
    __extends(ProofClaim, _super);
    /**
     * Creates claim about possession of some private data.
     * When created by the owner of the private data, this data must be contained
     * in `hashedFields`assosiative array. When created by verifier data must contain `token`
     * created during owner's creation of proof claim
     * @param { IProofClaimBuildData } data
     */
    function ProofClaim(data) {
        var _this = _super.call(this, data) || this;
        /**
        * secp256k1 curve
        */
        _this.curve = sjcl_complete_1.default.ecc.curves.k256;
        /**
         * prime order of the secp256k1 base
         */
        _this.q = _this.curve.r;
        /**
         * base of the secp256k1 curve
         */
        _this.g = _this.curve.G;
        _this.paranoia = 6;
        if (data.hashedFields) { // claim created by subject - owner of the hashed fields
            _this.tokenCreated = _this._createToken(data.hashedFields);
        }
        else { // claim created by verifier
            _this.token = data.token;
        }
        return _this;
    }
    /* eslint-disable new-cap */
    ProofClaim.prototype._createToken = function (hashedFields) {
        return __awaiter(this, void 0, void 0, function () {
            var proofData, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        proofData = {};
                        Object.entries(hashedFields).forEach(function (_a) {
                            var key = _a[0], field = _a[1];
                            var k = bn.random(_this.q, _this.paranoia);
                            var h = _this.curve.G.mult(k);
                            var a = new bn(field);
                            var PK = _this.curve.G.mult(a);
                            var c = bn.fromBits(hash.sha256.hash(_this.curve.G.x.toBits()
                                .concat(h.toBits())
                                .concat(PK.toBits())));
                            var ca = c.mul(a).mod(_this.q);
                            var s = ca.add(k).mod(_this.q);
                            proofData[key] = { h: h.toBits(), s: s.toBits() };
                        });
                        /* eslint-disable new-cap */
                        _a = this;
                        return [4 /*yield*/, this.jwt.sign(JSON.stringify(proofData))];
                    case 1:
                        /* eslint-disable new-cap */
                        _a.token = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Сhecks that the public keys in the `privateToken`'s payload matches values
     * based on which `this.token` payload was calculated
     * @example
     * ```typescript
     * import { ProofClaim } from '@ew-did-registry/claims';
     *
     * ------------------------------ owner -----------------------------------
     * const proofClaim = new ProofClaim({jwt, keys, claimData,  hashedFields });
     * const proofToken = proofClaim.token;
     * ----------------------------- verifier ---------------------------------
     * const proofClaim = new ProofClaim({jwt, keys, claimData, proofToken });
     * const privateToken = store.getClaim(claimUrl);
     * const verified = proofClaim.verify(privateToken);
     * ```
     * @param { string } privateToken
     */
    ProofClaim.prototype.verify = function (privateToken) {
        var _this = this;
        var verified = true;
        var proofData = this.jwt.decode(this.token);
        var verifyData = this.jwt.decode(privateToken);
        var names = Object.keys(verifyData);
        names.forEach(function (name) {
            var PK = _this.curve.fromBits(codec.hex.toBits(verifyData[name]));
            var h = _this.curve.fromBits(proofData[name].h);
            var s = bn.fromBits(proofData[name].s);
            var c = hash.sha256.hash(_this.curve.G.x.toBits()
                .concat(h.toBits())
                .concat(PK.toBits()));
            c = bn.fromBits(c);
            var left = _this.curve.G.mult(s);
            var right = PK.mult(c).toJac().add(h).toAffine();
            if (!sjcl_complete_1.default.bitArray.equal(left.toBits(), right.toBits())) {
                verified = false;
            }
        });
        return verified;
    };
    return ProofClaim;
}(public_1.Claim));
exports.ProofClaim = ProofClaim;
//# sourceMappingURL=proofClaim.js.map