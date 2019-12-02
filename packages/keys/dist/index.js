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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var elliptic_1 = require("elliptic");
var bn_js_1 = __importDefault(require("bn.js"));
// @ts-ignore
var ecies_parity_1 = __importDefault(require("ecies-parity"));
var functions_1 = require("./functions");
var ec = new elliptic_1.ec('secp256k1');
var Keys = /** @class */ (function () {
    /**
     * @param {string} privateKey
     * @param {string} publicKey
     */
    function Keys(_a) {
        var _b = _a === void 0 ? {} : _a, privateKey = _b.privateKey, publicKey = _b.publicKey;
        if (privateKey && publicKey) {
            this._keyPair = ec.keyFromPrivate(privateKey, 'hex');
            this.privateKey = privateKey;
            this.publicKey = publicKey;
        }
        else if (privateKey) {
            this._keyPair = ec.keyFromPrivate(privateKey, 'hex');
            this.privateKey = privateKey;
            this.publicKey = this._keyPair.getPublic(true, 'hex').padStart(66, '0');
        }
        else if (publicKey) {
            this._keyPair = ec.keyFromPublic(publicKey, 'hex');
            this.publicKey = publicKey;
        }
        else {
            var _c = Keys.generateKeyPair(), privateKey_1 = _c.privateKey, publicKey_1 = _c.publicKey;
            this._keyPair = ec.keyFromPrivate(privateKey_1, 'hex');
            this.privateKey = privateKey_1;
            this.publicKey = publicKey_1;
        }
    }
    /**
     * Decrypt the encrypted data that is given in hex format
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keysAlice = new Keys();
     * const keysBob = new Keys();
     * const data = 'test';
     * const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
     * const decrypted = await keysBob.decrypt(encrypted);
     * console.log(decrypted); // 'test'
     * ```
     *
     * @param {string} encrypted
     * @param {string} publicKey
     * @returns {Promise<string>}
     */
    Keys.prototype.decrypt = function (encrypted, publicKey) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedBuffer, privateKeyBuffer, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encryptedBuffer = Buffer.from(encrypted, 'hex');
                        privateKeyBuffer = Buffer.from(this.privateKey, 'hex');
                        return [4 /*yield*/, ecies_parity_1.default.decrypt(privateKeyBuffer, encryptedBuffer)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.toString()];
                }
            });
        });
    };
    /**
     * Encrypt the data that is given in utf-8 string
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keysAlice = new Keys();
     * const keysBob = new Keys();
     * const data = 'test';
     * const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
     * console.log(encrypted); // hex symbols string
     * ```
     *
     * @param {string} data
     * @param {string} publicKeyTo
     * @returns {Promise<string>}
     */
    Keys.prototype.encrypt = function (data, publicKeyTo) {
        return __awaiter(this, void 0, void 0, function () {
            var publicKeyToBuffer, dataBuffer, privateKeyBuffer, encrypted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        publicKeyToBuffer = Buffer.from(publicKeyTo, 'hex');
                        dataBuffer = Buffer.from(data);
                        privateKeyBuffer = Buffer.from(this.privateKey, 'hex');
                        return [4 /*yield*/, ecies_parity_1.default.encrypt(publicKeyToBuffer, dataBuffer, { ephemPrivateKey: privateKeyBuffer })];
                    case 1:
                        encrypted = _a.sent();
                        return [2 /*return*/, encrypted.toString('hex')];
                }
            });
        });
    };
    /**
     * Sign the data
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keys = new Keys();
     * const data = 'test';
     * const signature = keys.sign(data);
     * console.log(signature); // 128 hex symbols string
     * ```
     *
     * @param {string} data
     * @param {string} privateKey
     * @returns {string}
     */
    Keys.prototype.sign = function (data, privateKey) {
        var keyPair = this._keyPair;
        if (privateKey) {
            keyPair = ec.keyFromPrivate(privateKey, 'hex');
        }
        var hash = functions_1.sha256(data);
        var signature = keyPair.sign(hash, "hex", {
            canonical: true,
            pers: true,
        });
        return signature.r.toString(16, 64) + signature.s.toString(16, 64);
    };
    /**
     * Verify the signature
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keys = new Keys();
     * const data = 'test';
     * const signature = keys.sign(data);
     * console.log(keys.verify(signature)); // true
     * ```
     *
     * @param {string} data
     * @param {string} signature
     * @param {string} publicKey
     * @returns {boolean}
     */
    Keys.prototype.verify = function (data, signature, publicKey) {
        var keyPair = this._keyPair;
        if (publicKey) {
            keyPair = ec.keyFromPublic(publicKey, 'hex');
        }
        var r = new bn_js_1.default(signature.slice(0, 64), 16);
        var s = new bn_js_1.default(signature.slice(64, 128), 16);
        var hash = functions_1.sha256(data);
        return keyPair.verify(hash, { r: r, s: s });
    };
    /**
     * Generates new key pair for secp256k1 algorithm.
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keyPair = Keys.generateKeyPair();
     * console.log(keyPair.privateKey) // 64 hex symbols string
     * console.log(keyPair.publicKey) // 66 hex symbols string
     * ```
     *
     * @returns {KeyPair}
     */
    Keys.generateKeyPair = function () {
        var keyPair = ec.genKeyPair();
        return {
            privateKey: keyPair.getPrivate('hex').padStart(64, '0'),
            publicKey: keyPair.getPublic(true, 'hex').padStart(66, '0'),
        };
    };
    return Keys;
}());
exports.Keys = Keys;
//# sourceMappingURL=index.js.map