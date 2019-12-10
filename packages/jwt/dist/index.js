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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = __importStar(require("jsonwebtoken"));
var key_encoder_1 = __importDefault(require("key-encoder"));
var keyEncoder = new key_encoder_1.default('secp256k1');
var JWT = /** @class */ (function () {
    /**
     * Key pair has to be passed on construction to JWT
     * @param {Keys} keyPair
     */
    function JWT(keyPair) {
        this.keyPair = keyPair;
    }
    /**
     * Sign payload and return JWT
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     *
     * const keyPair = Keys.generateKeyPair();
     * const jwt = new JWT(keyPair);
     * const payload = {claim: 'test'};
     * let token;
     *
     * try {
     *   token = await jwt.sign(payload, { algorithm: 'ES256' });
     *   console.log(token);
     * } catch(e) {
     *   console.log(e);
     * }
     * ```
     *
     * @param {object} payload
     * @param {object} options
     * @returns {Promise<string>}
     */
    JWT.prototype.sign = function (payload, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var pemPrivateKey = keyEncoder.encodePrivate(_this.keyPair.privateKey, 'raw', 'pem');
                        jwt.sign(payload, pemPrivateKey, options, function (error, token) {
                            if (error)
                                reject(error);
                            resolve(token);
                        });
                    })];
            });
        });
    };
    /**
     * If the signature is correct, method returns decoded JWT payload
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     *
     * const AliceKeyPair = Keys.generateKeyPair();
     * const BobKeyPair = Keys.generateKeyPair();
     * const jwtAlice = new JWT(AliceKeyPair);
     * const jwtBob = new JWT(BobKeyPair);
     * const payload = {claim: 'test'};
     *
     * const token = await jwtAlice.sign(payload, { algorithm: 'ES256' });
     *
     * let decoded;
     *
     * try {
     *   decoded = await jwtBob.verify(token, AliceKeyPair.publicKey);
     *   console.log(decoded);
     * } catch(e) {
     *   console.log(e);
     * }
     * ```
     *
     * @param {string} token
     * @param {string} publicKey
     * @param {object} options
     * @returns {Promise<object>}
     */
    JWT.prototype.verify = function (token, publicKey, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var pemPublicKey = keyEncoder.encodePublic(publicKey, 'raw', 'pem');
                        jwt.verify(token, pemPublicKey, options, function (error, payload) {
                            if (error)
                                reject(error);
                            resolve(payload);
                        });
                    })];
            });
        });
    };
    /**
     * Return decoded JWT payload without verifying signature
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     *
     * const AliceKeyPair = Keys.generateKeyPair();
     * const BobKeyPair = Keys.generateKeyPair();
     * const jwtAlice = new JWT(AliceKeyPair);
     * const jwtBob = new JWT(jwtBob);
     * const payload = {claim: 'test'};
     *
     * const token = await jwtAlice.sign(payload, { algorithm: 'ES256' });
     *
     * const decoded = jwtBob.decode(token, {complete: true});
     * console.log(decoded.header);
     * console.log(decoded.payload.did);
     * ```
     *
     * @param {string} token
     * @param {object} options
     * @returns string | { [key: string]: any }
     */
    JWT.prototype.decode = function (token, options) {
        return jwt.decode(token, options);
    };
    return JWT;
}());
exports.JWT = JWT;
//# sourceMappingURL=index.js.map