import { IOperator, IResolver } from '@ew-did-registry/did-resolver';
import { IDIDDocumentFactory } from '../interface';
import { IDIDDocumentFull } from '../full';
import { IDIDDocumentLite } from '../lite';
declare class DIDDocumentFactory implements IDIDDocumentFactory {
    /**
     * Document subject did
     */
    private readonly _did;
    constructor(did: string);
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
    createFull(operator: IOperator, did?: string): IDIDDocumentFull;
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
    createLite(resolver: IResolver, did?: string): IDIDDocumentLite;
}
export default DIDDocumentFactory;
