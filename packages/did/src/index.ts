import { IDID } from './interface';
import { Networks } from './models';

/* eslint-disable no-underscore-dangle */
class DID implements IDID {
  /**
   * Mappings from networks to DIDs
   */
  private _dids: Map<Networks, string> = new Map();

  /**
   * DID general scheme
   * ToDo: make compatible with RFC3986
   */
  private _scheme = /^did:(\w+):(\w+)$/;

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
  get(network: Networks): string | undefined {
    if (!this.isValidNetwork(network)) {
      throw new Error('Invalid network');
    }
    return this._dids.get(network);
  }

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
  set(network: Networks | string, id?: string): IDID {
    if (network.startsWith('did:')) {
      return this.setDid(network);
    }
    return this.setDid(`did:${network}:${id}`);
  }

  private setDid(did: string) {
    const parts = did.match(this._scheme);
    if (!parts) {
      throw new Error('Wrong DID scheme');
    }
    const network = parts[1] as Networks;
    if (!this.isValidNetwork(network)) {
      throw new Error('Invalid network');
    }
    this._dids.set(network, did);
    return this;
  }

  private isValidNetwork(network: Networks): boolean {
    return Object.values(Networks).includes(network);
  }
}

export {
  IDID,
  DID,
  Networks,
};
