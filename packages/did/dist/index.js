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
    }
    /**
     * Gets a DID for a particular network
     *
     * @example
     * ```typescript
     * import { DID, Network } from '@ew-did-registry/did';
     *
     * const did = new DID();
     * did.set('bitcoin', 'method_specific_id');
     * console.log(did.get('bitcoin')); // 'did:bitcoin:method_specific_id'
     *
     * const did = new DID();
     * did.set(Networks.Ethereum, 'method_specific_id');
     * console.log(did.get(Networks.Ethereum)); // 'did:eth:method_specific_id'
     * ```
     *
     * @param { Networks } network
     *
     * @returns { string|undefined }
     */
    DID.prototype.get = function (network) {
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
            return this._setDid(network);
        }
        return this._setDid("did:" + network + ":" + id);
    };
    DID.prototype._setDid = function (did) {
        var _a = did.split(':'), network = _a[1], id = _a[2];
        if (id === undefined) {
            throw new Error('DID must consist of three parts separated by a colon');
        }
        if (!models_1.DID_SCHEME_PATTERNS.NETWORK.test(network)) {
            throw new Error('Network must not be empty and consist only of lowcase alphanumerical characters');
        }
        if (!models_1.DID_SCHEME_PATTERNS.ID.test(id)) {
            throw new Error('Id must consist only of alphanumerical characters, dots, minuses and underscores');
        }
        this._dids.set(network, did);
        return this;
    };
    return DID;
}());
exports.DID = DID;
//# sourceMappingURL=index.js.map