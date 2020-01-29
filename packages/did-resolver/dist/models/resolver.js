"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Specifies currently supported provider types. New types can be added in the future.
 */
var ProviderTypes;
(function (ProviderTypes) {
    ProviderTypes[ProviderTypes["HTTP"] = 0] = "HTTP";
    ProviderTypes[ProviderTypes["IPC"] = 1] = "IPC";
})(ProviderTypes = exports.ProviderTypes || (exports.ProviderTypes = {}));
/**
 * Our assumption that delegates can be of two types, according to the standard. However,
 * Other types can be added in the future, if required.
 */
var DelegateTypes;
(function (DelegateTypes) {
    DelegateTypes["authentication"] = "sigAuth";
    DelegateTypes["verification"] = "veriKey";
})(DelegateTypes = exports.DelegateTypes || (exports.DelegateTypes = {}));
//# sourceMappingURL=resolver.js.map