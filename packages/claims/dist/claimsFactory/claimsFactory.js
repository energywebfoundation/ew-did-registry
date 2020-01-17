"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var claimsUser_1 = __importDefault(require("../claimsUser/claimsUser"));
var claimsIssuer_1 = require("../claimsIssuer");
var claimsVerifier_1 = require("../claimsVerifier");
/**
 * An implementation of claim factory
 * @class
 */
var ClaimsFactory = /** @class */ (function () {
    function ClaimsFactory(keys, resolver) {
        this._keys = keys;
        this._resolver = resolver;
    }
    ClaimsFactory.prototype.createClaimsUser = function () {
        return new claimsUser_1.default(this._keys, this._resolver);
    };
    ClaimsFactory.prototype.createClaimsIssuer = function () {
        return new claimsIssuer_1.ClaimsIssuer(this._keys, this._resolver);
    };
    ClaimsFactory.prototype.createClaimsVerifier = function () {
        return new claimsVerifier_1.ClaimsVerifier(this._keys, this._resolver);
    };
    return ClaimsFactory;
}());
exports.ClaimsFactory = ClaimsFactory;
//# sourceMappingURL=claimsFactory.js.map