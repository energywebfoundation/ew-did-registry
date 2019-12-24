import { IDIDDocument } from '@ew-did-registry/did-resolver';
/**
 * Interface describes the lite version of DID Document with only read functionality
 */
export interface IDIDDocumentLite {
    /**
     * Constructor takes DID and Resolver as inputs
     * constructor(did: string, resolver: IResolver);
     *
     * Private member:
     * resolver;
     */
    /**
     * DID of Document subject is stored in DID Documents
     */
    did: string;
    /**
     * Resolved DID Document
     */
    didDocument: IDIDDocument;
    /**
     * Fetches the specified data/attributes from DID Document
     * @param {string} attribute
     * @param {string} type
     * @returns {strings}
     */
    read(attribute: string, type?: string): string | object;
}
