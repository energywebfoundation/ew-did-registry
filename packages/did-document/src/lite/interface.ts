import {
  IDIDDocument,
  DelegateTypes,
  IVerificationMethod,
  IServiceEndpoint,
  IAuthentication,
  DocumentSelector,
  IDIDLogData,
} from '@fl-did-registry/did-resolver-interface';
import { BigNumber } from 'ethers';

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
   *
   * @param did {string}
   */
  read(did?: string): Promise<IDIDDocument>;

  /**
   * Returns the current owner for certain DID.
   *
   * @param {string} did
   * @returns {Promise<string>}
   */
  getController(did?: string): Promise<string>;

  /**
   * Checks if the delegate is present for a particular DID.
   * Returns boolean.
   *
   * @param {DelegateTypes} delegateType
   * @param {string} delegateDID
   * @param {string} did
   * @returns {Promise<boolean>}
   */
  isValidDelegate(
    delegateType: DelegateTypes, delegateDID: string, did?: string,
  ): Promise<boolean>;

  /**
   * Finds first attribute which satisfies filter
   *
   * @param selector {{ [attr: string]: { [prop: string]: string } }} object used
   *  to describe part of the document. `attr` is one of standard DID attributes
   *  like `publicKey`, `serviceEndpoints` or `authentication` and `prop` - properties
   *  of this attribute such as `type` or `value`
   * @param did {string}
   *
   * @returns {object | null}
   */
  readAttribute(
    selector: DocumentSelector, did?: string,
  ): Promise<IVerificationMethod | IServiceEndpoint | IAuthentication | undefined>;

  /**
   * Document owner public key
   *
   * @param {string} did
   */
  ownerEthAddress(did?: string): Promise<string | undefined>;

  lastBlock(did?: string): Promise<BigNumber>;

  readFromBlock(
    did: string,
    from: BigNumber,
  ): Promise<IDIDLogData>;

  fromLogs(logs: IDIDLogData[], did?: string): Promise<IDIDDocument>;
}
