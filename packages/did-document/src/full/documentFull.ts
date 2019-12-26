import { DIDAttribute, IOperator, IUpdateData } from '@ew-did-registry/did-resolver';
import { BigNumber } from 'ethers/utils';
import { IDIDDocumentFull } from './interface';
import { DIDDocumentLite } from '../lite';

class DIDDocumentFull extends DIDDocumentLite implements IDIDDocumentFull {
  private _operator: IOperator;

  constructor(did: string, operator: IOperator) {
    super(did, operator);
    this._operator = operator;
  }

  async create(context?: string): Promise<boolean> {
    return this._operator.create(this.did, context);
  }

  async deactivate(): Promise<boolean> {
    return this._operator.deactivate(this.did);
  }

  async update(
    attribute: DIDAttribute,
    data: IUpdateData,
    validity: number | BigNumber,
  ): Promise<boolean> {
    return this._operator.update(this.did, attribute, data, validity);
  }
}

export default DIDDocumentFull;
