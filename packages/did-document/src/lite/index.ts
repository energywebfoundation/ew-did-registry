import { BigNumber } from 'ethers';
import {
  IDIDDocument,
  IResolver,
  DelegateTypes,
  IVerificationMethod,
  IServiceEndpoint,
  IAuthentication,
  DocumentSelector,
  IDIDLogData,
} from '@fl-did-registry/did-resolver-interface';
import { documentFromLogs } from '@fl-did-registry/did-nft-resolver';
import { Methods } from '@fl-did-registry/did';
import { IDIDDocumentLite } from './interface';

class DIDDocumentLite implements IDIDDocumentLite {
  /**
* @param {string} did - entity identifier, which is associated with DID Document
* @param {IResolver} resolver - resolver exposing read functionality of DID Document
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
    return `did:${Methods.Erc1056}:${await this.resolver.identityOwner(did)}`;
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
   * @param selector {{ [attr: string]: { [prop: string]: string } }} object used
   *  to describe part of the document. `attr` is one of standard DID attributes
   *  like `publicKey`, `serviceEndpoints` or `authentication` and `prop` - properties
   *  of this attribute such as `type` or `value`
   * @param did {string}
   *
   * @returns {object | null}
   */
  async readAttribute(
    selector: DocumentSelector, did = this.did,
  ): Promise<IVerificationMethod | IServiceEndpoint | IAuthentication | undefined> {
    return this.resolver.readAttribute(did, selector);
  }

  /**
   * Returns document of the given `did`
   *
   * @param did {string}
   */
  async read(did = this.did): Promise<IDIDDocument> {
    return this.resolver.read(did);
  }

  async ownerEthAddress(did = this.did): Promise<string | undefined> {
    return this.resolver.identityOwner(did);
  }

  async lastBlock(did: string): Promise<BigNumber> {
    return this.resolver.lastBlock(did);
  }

  async readFromBlock(did: string, from: BigNumber): Promise<IDIDLogData> {
    return this.resolver.readFromBlock(did, from);
  }

  async fromLogs(logs: IDIDLogData[], did = this.did): Promise<IDIDDocument> {
    return documentFromLogs(did, await this.getController(), logs);
  }
}

export { IDIDDocumentLite, DIDDocumentLite };
