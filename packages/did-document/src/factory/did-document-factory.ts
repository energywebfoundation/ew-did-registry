import { IOperator, IResolver } from '@ew-did-registry/did-resolver';
import { IDIDDocumentFactory } from '../interface';
import { DIDDocumentFull, IDIDDocumentFull } from '../full';
import { DIDDocumentLite, IDIDDocumentLite } from '../lite';

class DIDDocumentFactory implements IDIDDocumentFactory {
  private _did: string;

  constructor(did: string) {
    this._did = did;
  }

  createFull(operator: IOperator, did?: string): IDIDDocumentFull {
    return new DIDDocumentFull(did || this._did, operator);
  }

  createLite(resolver: IResolver, did?: string): IDIDDocumentLite {
    return new DIDDocumentLite(did || this._did, resolver);
  }
}

export default DIDDocumentFactory;
