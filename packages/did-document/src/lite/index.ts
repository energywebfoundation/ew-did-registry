import {
  IDIDDocument, IResolver, DelegateTypes, IPublicKey, IServiceEndpoint, IAuthentication,
} from '@ew-did-registry/did-resolver-interface';
import { IDIDDocumentLite } from './interface';

class DIDDocumentLite implements IDIDDocumentLite {
  /**
* @param {string} did
* @param {IResolver} resolver
*/
  // eslint-disable-next-line no-useless-constructor
  constructor(public did: string, private resolver: IResolver) { }

  /**
   * Returns the current owner for certain DID.
   * If owner not assigned explicitly than identity is the owner of itself
   *
   * @param {string} did
   * @returns {Promise<string>}
   */
  async getController(did = this.did): Promise<string> {
    return this.resolver.identityOwner(did);
  }

  /**
   * Checks if the delegate is present for a particular DID.
   *
   * @param {DelegateTypes} delegateType
   * @param {string} delegateDID
   * @param {string} did
   * @returns {Promise<boolean>}
   */
  async isValidDelegate(
    delegateType: DelegateTypes, delegateDID: string, did = this.did,
  ): Promise<boolean> {
    return this.resolver.validDelegate(did, delegateType, delegateDID);
  }

  /**
   * Finds first attribute which satisfies filter
   *
   * @param filter {{ [attr: string]: { [prop: string]: string } }} object used
   *  to describe part of the document. `attr` is one of standard DID attributes
   *  like `publicKey`, `serviceEndpoints` or `authentication` and `prop` - properties
   *  of this attribute such as `type` or `value`
   * @param did {string}
   *
   * @returns {object | null}
   */
  async readAttribute(
    filter: { [key: string]: { [key: string]: string } }, did = this.did,
  ): Promise<IPublicKey | IServiceEndpoint | IAuthentication> {
    return this.resolver.readAttribute(did, filter);
  }

  /**
   * Returns document of the given `did`
   *
   * @param did {string}
   */
  async read(did = this.did): Promise<IDIDDocument> {
    return this.resolver.read(did);
  }

  async ownerPubKey(did = this.did): Promise<string> {
    return this.resolver.readOwnerPubKey(did);
  }
}

export { IDIDDocumentLite, DIDDocumentLite };
