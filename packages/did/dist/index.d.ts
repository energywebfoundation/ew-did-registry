import { IDID } from './interface';
import { Networks } from './models';
declare class DID implements IDID {
    /**
     * Mappings from networks to DIDs
     */
    private _dids;
    /**
     * DID general scheme
     * ToDo: make compatible with RFC3986
     */
    private _scheme;
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
    set(did: string): void;
    private setDid;
}
export { IDID, DID, Networks, };
