import {
  IDIDDocument, DelegateTypes, IPublicKey, IServiceEndpoint, IAuthentication,
} from '@ew-did-registry/did-resolver-interface';

/**
 * Interface describes the lite version of DID Document with only read functionality
 */
export interface IDIDDocumentLite {

  /**
 * DID used in read methods if not provided explicitly
 */
  did: string;

  /**
   * Returns document of the given `did`
   * @param did {string}
   */
  read(did?: string): Promise<IDIDDocument>;

  /**
   * Returns the current owner for certain DID.
   * If owner not assigned explicitly than identity is the owner of itself
   *
   * @param {string} did
   * @returns {Promise<string>}
   */
  identityOwner(did?: string): Promise<string>;

  /**
   * Checks if the delegate is present for a particular DID.
   * Returns boolean.
   *
   * @param {DelegateTypes} delegateType
   * @param {string} delegateDID
   * @param {string} did
   * @returns {Promise<boolean>}
   */
  validDelegate(
    delegateType: DelegateTypes, delegateDID: string, did?: string,
  ): Promise<boolean>;

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
  readAttribute(
    filter: { [attr: string]: { [prop: string]: string } }, did?: string,
  ): Promise<IPublicKey | IServiceEndpoint | IAuthentication>;
}
