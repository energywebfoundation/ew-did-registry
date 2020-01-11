import { IDID } from './interface';
import { Networks } from './models';
declare class DID implements IDID {
    /**
     * Mappings from networks to DIDs
     */
    private _dids;
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
    get(network: Networks): string | undefined;
    /**
     * Sets a DID for a particular network (inferred from DID provided)
     *
     * @example
     * ```typescript
     * import { DID } from '@ew-did-registry/did';
     *
     * const did = new DID();
     * did.set('did:eth:method_specific_id');
     * console.log(did.get('eth')); // 'did:eth:method_specific_id'
     * ```
     *
     * @param {string} did
     *
     * @returns {void}
     */
    set(did: string): IDID;
    private _setDid;
}
export { IDID, DID, Networks, };
