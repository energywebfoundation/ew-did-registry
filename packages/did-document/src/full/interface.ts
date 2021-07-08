import { DIDAttribute, IUpdateData, VerificationMethodType } from '@ew-did-registry/did-resolver-interface';
import { utils } from 'ethers';
import { IDIDDocumentLite } from '../lite';

/**
 * Interface describes the full version of DID Document with CRUD functionality
 * This interface extends lite DID Document interface
 */
export interface IDIDDocumentFull extends IDIDDocumentLite {

  /**
   * New DID Document is registered on the Blockchain,
   * @returns {boolean}
   */
  create(): Promise<boolean>;

  /**
   * Provided with necessary parameters, method updates relevant attributes of the DID Document
   * @param {string} attribute
   * @param {IUpdateParameters} data
   * @returns {boolean}
   */
  update(
    attribute: DIDAttribute, data: IUpdateData, validity?: number | utils.BigNumber
  ): Promise<utils.BigNumber>;

  /**
   * On success the status of the DID Document is changed from “active” to “deactivated”.
   * @returns {boolean}
   */
  deactivate(): Promise<void>;

  revokeDelegate(delegateType: VerificationMethodType, delegateDID: string): Promise<boolean>;

  revokeAttribute(attributeType: DIDAttribute, updateData: IUpdateData): Promise<boolean>;
}
