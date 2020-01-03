"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var full_1 = require("../full");
var lite_1 = require("../lite");
var DIDDocumentFactory = /** @class */ (function () {
    function DIDDocumentFactory(did) {
        this._did = did;
    }
    /**
     * Creates an instance of DIDDocumentFull
     *
     * @example
     * ```typescript
     * import { DIDDocumentFactory, DIDDocumentFull } from '@ew-did-registry/did-document';
     *
     * const factory = new DIDDocumentFactory(did);
     * const DIDDocumentFull = factory.createFull(operator);
     * ```
     * @param { IOperator } operator
     * @param { string } did
     *
     * @return { DIDDocumentFull }
     */
    DIDDocumentFactory.prototype.createFull = function (operator, did) {
        return new full_1.DIDDocumentFull(did || this._did, operator);
    };
    /**
     * Creates an instance of DIDDocumentFull
     *
     * @example
     * ```typescript
     * import { DIDDocumentFactory, DIDDocumentLite } from '@ew-did-registry/did-document';
     *
     * const factory = new DIDDocumentFactory(did);
     * const DIDDocumentFull = factory.createLite(resolver);
     * ```
     * @param { IResolver } operator
     * @param { string } did
     *
     * @return { DIDDocumentLite }
     */
    DIDDocumentFactory.prototype.createLite = function (resolver, did) {
        return new lite_1.DIDDocumentLite(did || this._did, resolver);
    };
    return DIDDocumentFactory;
}());
exports.default = DIDDocumentFactory;
//# sourceMappingURL=did-document-factory.js.map