"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var models_1 = require("./models");
exports.Networks = models_1.Networks;
/* eslint-disable no-underscore-dangle */
var DID = /** @class */ (function () {
    function DID() {
        /**
         * Mappings from networks to DIDs
         */
        this._dids = new Map();
        /**
         * DID general scheme
         * ToDo: make compatible with RFC3986
         */
        this._scheme = /^did:(\w+):(\w+)$/;
    }
    /**
     * Gets a DID for a particular network
     *
     * @example
     * ```typescript
     * import { DID } from '@ew-did-registry/did';
     *
     * const did = new DID();
     * did.set('eth', 'method_specific_id');
     * console.log(did.get('eth')); // 'did:eth:method_specific_id'
     * ```
     *
     * @param { Networks } network
     *
     * @returns { string|undefined }
     */
    DID.prototype.get = function (network) {
        if (!Object.values(models_1.Networks).includes(network)) {
            return undefined;
        }
        return this._dids.get(network);
    };
    /**
     * Sets a DID for the provided network
     *
     * @example
     * ```typescript
     * import { DID } from '@ew-did-registry/did';
     *
     * const did = new DID();
     * did.set('eth', 'method_specific_id');
     * console.log(did.get('eth')); // 'did:eth:method_specific_id'
     * ```
     *
     * @param { Networks } network
     * @param {string} id
     *
     * @returns {void}
     */
    // eslint-disable-next-line no-dupe-class-members
    DID.prototype.set = function (network, id) {
        if (network.startsWith('did:')) {
            this.setDid(network);
            return;
        }
        var did = "did:" + network + ":" + id;
        this.setDid(did);
    };
    DID.prototype.setDid = function (did) {
        var parts = did.match(this._scheme);
        if (!parts) {
            throw new Error('Wrong DID scheme');
        }
        var method = parts[1];
        if (!Object.values(models_1.Networks).includes(method)) {
            throw new Error('Invalid network');
        }
        this._dids.set(method, did);
    };
    return DID;
}());
exports.DID = DID;
//# sourceMappingURL=index.js.map