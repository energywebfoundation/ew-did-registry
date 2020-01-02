import { IDIDDocument, IResolver } from '@ew-did-registry/did-resolver';
import { IDIDDocumentLite } from './interface';
declare class DIDDocumentLite implements IDIDDocumentLite {
    /**
     * Resolver that fetches DID Document
     */
    private readonly resolver;
    /**
     * DID of concern
     */
    did: string;
    /**
     * Fetched DID Document
     */
    didDocument: IDIDDocument;
    /**
     * Constructor takes DID of interest and Resolver as inputs
     * @param {string} did
     * @param {Resolver} resolver
     */
    constructor(did: string, resolver: IResolver);
    /**
     * Method returns the attribute of interest. An optional type parameter can be provided for
     * attributes, which are objects
     *
     * @example
     * ```typescript
     * import { Resolver } from '@ew-did-registry/did-resolver';
     * import { DIDDocumentFactory } from '@ew-did-registry/did-document';
     *
     * const sampleDid = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
     * const resolver = new Resolver();
     * const didLiteDocument = DIDDocumentFactory.createLite(sampleDid, resolver);
     * const id = didDocumentLite.read('id');
     *
     * console.log(`DID of the fetched document is ${id}`);
     * ```
     *
     * @param {string} attribute
     * @param {string} type
     */
    read(attribute: string, type: string): Promise<any>;
}
export { IDIDDocumentLite, DIDDocumentLite };
