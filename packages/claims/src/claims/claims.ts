import { IResolver, IDIDDocument } from '@ew-did-registry/did-resolver';
import { IDIDDocumentLite, DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { Networks } from '@ew-did-registry/did';
import { IClaims } from '../models';

export class Claims implements IClaims {
    /**
     * Used for creation of new Resolvers
     */
    private readonly resolver: IResolver;

    /**
     * Light document is used for fetching the DID Document
     */
    protected readonly didDocumentLite: IDIDDocumentLite;

    /**
     * didDocument is used to store fetched DID Document
     */
    public didDocument: IDIDDocument;

    /**
     * jwt stores the JWT to manage web tokens
     */
    public jwt: IJWT;

    /**
     * claimToken stores the actual serialised JWT in a string format
     */
    public token: string;

    /**
     * keyPair represents the implementation of key management interface
     */
    public keys: IKeys;

    public did: string;

    /**
     * Constructor
     *
     * IClaimBuildData has to be passed to construct any type of Claim
     * @param {IClaimBuildData} data
     */
    constructor(keys: IKeys, resolver: IResolver) {
      this.resolver = resolver;
      this.keys = keys;
      this.jwt = new JWT(keys);
      this.did = `did:${Networks.Ethereum}:0x${keys.publicKey}`;
    }

    /**
     * Method fetches the DID Document associated with did provided in claim data
     * DID Document is then stored as a member of Claim class. Returns true on success
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * import { Claim } from '@ew-did-registry/claims';
     *
     * const keys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     *   did: `did:ewc:0x${keys.publicKey}`,
     *   test: 'test',
     * };
     * const data = {
     *   jwt,
     *   keyPair: keys,
     *   claimData,
     * };
     * const publicClaim = new Claim(data);
     * await publicClaim.getDid();
     * console.log(publicClaim.didDocument);
     * ```
     *
     * @returns {Promise<IDIDDocument>}
     */
    async getDocument(did: string): Promise<IDIDDocument> {
      const documentFactory = new DIDDocumentFactory(did);
      const didDocumentLite = documentFactory.createLite(this.resolver);
      await didDocumentLite.read(did);
      return didDocumentLite.didDocument;
    }

    async verifySignature(token: string, signer: string): Promise<boolean> {
      const issuerDocument = await this.getDocument(signer);
      const issuerPublicKey = issuerDocument
        .publicKey
        .find((pk: { type: string }) => pk.type === 'Secp256k1VerificationKey')
        .ethereumAddress;
      try {
        await this.jwt.verify(token, issuerPublicKey.slice(2));
      } catch (error) {
        return false;
      }
      return true;
    }
}
