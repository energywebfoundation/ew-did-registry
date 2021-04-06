import { IDID } from './interface';
import { DID_SCHEME_PATTERNS, Methods } from './models';

/* eslint-disable no-underscore-dangle */
class DID implements IDID {
  /**
   * Mappings from methods to DIDs
   */
  private _dids: Map<string, string> = new Map();

  /**
   * Gets a DID for a particular method
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
   * did.set(Methods.Erc1056, 'method_specific_id');
   * console.log(did.get(Methods.Erc1056)); // 'did:eth:method_specific_id'
   * ```
   *
   * @param { Methods } method
   *
   * @returns { string|undefined }
   */
  get(method: Methods): string | undefined {
    return this._dids.get(method);
  }

  /**
   * Sets a DID for a particular method (inferred from DID provided)
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
   * Sets a DID for the provided method
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
   * @param { Methods } method
   * @param {string} id
   *
   * @returns {void}
   */
  // eslint-disable-next-line no-dupe-class-members
  set(method: Methods | string, id?: string): IDID {
    if (method.startsWith('did:')) {
      return this._setDid(method);
    }
    return this._setDid(`did:${method}:${id}`);
  }

  private _setDid(did: string): IDID {
    const [, method, id] = did.split(':');
    if (id === undefined) {
      throw new Error('DID must consist of three parts separated by a colon');
    }
    if (!DID_SCHEME_PATTERNS.NETWORK.test(method)) {
      throw new Error('Network must not be empty and consist only of lowcase alphanumerical characters');
    }
    if (!DID_SCHEME_PATTERNS.ID.test(id)) {
      throw new Error('Id must consist only of alphanumerical characters, dots, minuses and underscores');
    }
    this._dids.set(method, did);
    return this;
  }
}

export {
  IDID,
  DID,
  Methods,
};
