import { IDID } from './interface';
import { Networks } from './models';

/* eslint-disable no-underscore-dangle */
class DID implements IDID {
  /**
   * Mappings from networks to DIDs
   */
  private _dids: Map<string, string> = new Map();

  /**
   * DID specification rule for method-name
   * The pattern allows an empty identifier to identify a method or did-registry
   * See [Issue 34] {@link https://github.com/w3c/did-core/issues/34}
   */
  private _networkPattern=/[a-z]+/;

  /**
   * DID specification rule for method-specific-id
   */
  private _idPattern=/[\w.-]*(:[\w.-]*)*/;

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
  get(network: Networks): string | undefined {
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
      return this._setDid(network);
    }
    return this._setDid(`did:${network}:${id}`);
  }

  private _setDid(did: string): IDID {
    const [, network, id] = did.split(':');
    if (id === undefined) {
      throw new Error('DID must consist of three parts separated by a colon');
    }
    if (!this._networkPattern.test(network)) {
      throw new Error('Network must not be empty and consist only of lowcase alphanumerical characters');
    }
    if (!this._idPattern.test(id)) {
      throw new Error('Id must consist only of alphanumerical characters, dots, minuses and underscores');
    }
    this._dids.set(network, did);
    return this;
  }
}

export {
  IDID,
  DID,
  Networks,
};
