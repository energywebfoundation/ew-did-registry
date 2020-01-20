"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var claimsUser_1 = require("../claimsUser");
var claimsIssuer_1 = require("../claimsIssuer");
var claimsVerifier_1 = require("../claimsVerifier");
/**
 * An implementation of claims factory
 * @class
 */
var ClaimsFactory = /** @class */ (function () {
    function ClaimsFactory(keys, resolver) {
        this._keys = keys;
        this._resolver = resolver;
    }
    /**
     * Constructs instance of ClaimsUser
     *
     * @returns { IClaimsUser }
     */
    ClaimsFactory.prototype.createClaimsUser = function () {
        return new claimsUser_1.ClaimsUser(this._keys, this._resolver);
    };
    /**
     * Contstructs instance of ClaimsIssuer
     *
     * @returns { IClaimsIssuer }
     */
    ClaimsFactory.prototype.createClaimsIssuer = function () {
        return new claimsIssuer_1.ClaimsIssuer(this._keys, this._resolver);
    };
    /**
     * Constructs instance of ClaimsUser
     *
     * @returns { IClaimsVerifier }
     */
    ClaimsFactory.prototype.createClaimsVerifier = function () {
        return new claimsVerifier_1.ClaimsVerifier(this._keys, this._resolver);
    };
    return ClaimsFactory;
}());
exports.ClaimsFactory = ClaimsFactory;
//# sourceMappingURL=claimsFactory.js.map