"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var did_document_1 = require("@ew-did-registry/did-document");
var claims_1 = require("@ew-did-registry/claims");
var DIDRegistry = /** @class */ (function () {
    function DIDRegistry(keys, did, resolver) {
        var _a = did.split(':'), network = _a[1], id = _a[2];
        this.keys = new Map();
        this.keys.set(network, keys);
        this.documentFactory = new did_document_1.DIDDocumentFactory(did);
        this.claims = new claims_1.ClaimsFactory(keys, resolver);
        this.resolver = resolver;
    }
    DIDRegistry.prototype.changeResolver = function (resolver, network) {
        var relevantKeys = this.keys.get(network);
        this.documentFactory = new did_document_1.DIDDocumentFactory(this.did.get(network));
        this.claims = new claims_1.ClaimsFactory(relevantKeys, resolver);
        this.resolver = resolver;
    };
    return DIDRegistry;
}());
exports.default = DIDRegistry;
//# sourceMappingURL=index.js.map