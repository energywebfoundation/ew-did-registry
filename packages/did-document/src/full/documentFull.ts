import { IOperator, IUpdateData } from '@ew-did-registry/did-resolver';
import { IDIDDocumentFull } from './interface';
import { DIDDocumentLite } from '../lite';

class DIDDocumentFull extends DIDDocumentLite implements IDIDDocumentFull {
private _operator: IOperator;

constructor(did: string, operator: IOperator) {
  super(did, operator);
  this._operator = operator;
}

create(context: string): boolean {
  return false;
}

deactivate(): boolean {
  return false;
}

update(attribute: string, data: IUpdateData): boolean {
  return false;
}
}

export default DIDDocumentFull;
