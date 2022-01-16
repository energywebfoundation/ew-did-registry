import {
  DIDAttribute,
  IOperator,
  IUpdateData,
  PubKeyType,
} from '@ew-did-registry/did-resolver-interface';
import { BigNumber } from 'ethers';
import { IDIDDocumentFull } from './interface';
import { DIDDocumentLite } from '../lite';

class DIDDocumentFull extends DIDDocumentLite implements IDIDDocumentFull {
  private _operator: IOperator;

  constructor(did: string, operator: IOperator) {
    super(did, operator);
    this._operator = operator;
  }

  /**
   * Creates new empty DID document
   *
   * @example
   * ```typescript
   *  import { DIDDocumentFull } from '@ew-did-registry/did-document';
   *
   *  const document = new DIDDocumentFull(did, operator);
   *  await document.create();
   * ```
   * @return { boolean }
   */
  async create(): Promise<boolean> {
    return this._operator.create();
  }

  /**
   * Deactivates DID document
   *
   * @example
   * ```typescript
   * import { DIDDocumentFull } from '@ew-did-registry/did-document';
   *
   * const document = new DIDDocumentFull(did, operator);
   * await document.create();
   * await document.update(didAttribute, updateData, validity);
   * await document.deactivate();
   * ```
   * @return { boolean }
   */
  async deactivate(): Promise<void> {
    await this._operator.deactivate(this.did);
  }

  /**
   * Updates attribute on the DID document
   *
   * @example
   * ```typescript
   * import { DIDDocumentFull } from '@ew-did-registry/did-document';
   * import { DIDAttribute, Algorithms, PubKeyTypes } from '@ew-did-registry/did-document';
   *
   * const document = new DIDDocumentFull(did, operator);
   * await document.create();
   * const didAttribute = DIDAttribute.PublicKey;
   * const validity = 5 * 60 * 1000;
   * await document.update(
   *  didAttribute,
   *  {
   *    type: PubKeyType.VerificationKey2018,
   *    value: new Keys().publicKey,
   *  },
   *  validity,
   *  );
   * ```
   * @param { DIDAttribute } attribute
   * @param { IUpdateData } data
   * @param { number } validity - time in milliseconds during the attribute will be valid
   * if missing it should be set to Number.MAX_SAFE_INTEGER by the operator
   * @return { boolean }
   */
  async update(
    attribute: DIDAttribute,
    data: IUpdateData,
    validity?: number
  ): Promise<BigNumber> {
    return this._operator.update(this.did, attribute, data, validity);
  }

  async revokeDelegate(
    delegateType: PubKeyType,
    delegateDID: string
  ): Promise<boolean> {
    return this._operator.revokeDelegate(this.did, delegateType, delegateDID);
  }

  async revokeAttribute(
    attributeType: DIDAttribute,
    updateData: IUpdateData
  ): Promise<boolean> {
    return this._operator.revokeAttribute(this.did, attributeType, updateData);
  }
}

export default DIDDocumentFull;
