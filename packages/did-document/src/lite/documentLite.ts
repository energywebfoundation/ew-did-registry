import { IDIDDocument, IResolver } from '@ew-did-registry/did-resolver';
import { IDIDDocumentLite } from './interface';

class DIDDocumentLite implements IDIDDocumentLite {
  did: string;

  didDocument: IDIDDocument;

  protected _resolver: IResolver;

  constructor(did: string, resolver: IResolver) {
    this.did = did;
    this._resolver = resolver;
  }

  read(attribute: string, type?: string): string | object {
    return undefined;
  }
}

export default DIDDocumentLite;
