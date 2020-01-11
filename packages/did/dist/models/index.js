"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Networks;
(function (Networks) {
    Networks["Ethereum"] = "eth";
    Networks["EnergyWeb"] = "ewc";
})(Networks = exports.Networks || (exports.Networks = {}));
exports.DID_SCHEME_PATTERNS = {
    NETWORK: /^[a-z0-9]+$/,
    /**
       * DID specification rule for method-specific-id
     * DID specification rule for method-name
     * The pattern allows an empty identifier to identify a method or did-registry
     * See [Issue 34] {@link https://github.com/w3c/did-core/issues/34}
       */
    ID: /^[\w.-]*(:[\w.-]*)*$/,
};
//# sourceMappingURL=index.js.map