import { IOperator, IResolver } from '@ew-did-registry/did-resolver-interface';
import { IDIDDocumentFactory } from '../interface';
import { DIDDocumentFull, IDIDDocumentFull } from '../full';
import { DIDDocumentLite, IDIDDocumentLite } from '../lite';

class DIDDocumentFactory implements IDIDDocumentFactory {
  /**
   * Document subject did
   */
  private readonly _did: string;

  constructor(did: string) {
    this._did = did;
  }

  /**
   * Creates an instance of DIDDocumentFull
   *
   * @example
   * ```typescript
   * import { DIDDocumentFactory, DIDDocumentFull } from '@ew-did-registry/did-document';
   *
   * const factory = new DIDDocumentFactory(did);
   * const DIDDocumentFull = factory.createFull(operator);
   * ```
   * @param { IOperator } operator
   * @param { string } did
   *
   * @return { DIDDocumentFull }
   */
  createFull(operator: IOperator, did?: string): IDIDDocumentFull {
    return new DIDDocumentFull(did || this._did, operator);
  }

  /**
   * Creates an instance of DIDDocumentFull
   *
   * @example
   * ```typescript
   * import { DIDDocumentFactory, DIDDocumentLite } from '@ew-did-registry/did-document';
   *
   * const factory = new DIDDocumentFactory(did);
   * const DIDDocumentFull = factory.createLite(resolver);
   * ```
   * @param { IResolver } operator
   * @param { string } did
   *
   * @return { DIDDocumentLite }
   */
  createLite(resolver: IResolver, did?: string): IDIDDocumentLite {
    return new DIDDocumentLite(did || this._did, resolver);
  }
}

export default DIDDocumentFactory;
