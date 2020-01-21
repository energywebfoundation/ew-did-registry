import { IDIDDocument, IResolver, Resolver } from '@ew-did-registry/did-resolver';
import { IDIDDocumentLite } from './interface';

class DIDDocumentLite implements IDIDDocumentLite {
    /**
     * Resolver that fetches DID Document
     */
    private readonly resolver: IResolver;

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
    constructor(did: string, resolver: IResolver) {
      this.resolver = resolver;
      this.did = did;
    }

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
    async read(attribute: string, type: string) {
      console.log(`Will use resolver to fetch document for: ${this.did}`);
      this.didDocument = await this.resolver.read(this.did);

      if (type === undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        return this.didDocument[attribute];
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const PubAuthService = this.didDocument[attribute];
      if (PubAuthService === undefined) {
        return PubAuthService;
      }
      const instance = PubAuthService.find((member: { type: string }) => member.type === type);
      return instance;
    }
}

export { IDIDDocumentLite, DIDDocumentLite };
