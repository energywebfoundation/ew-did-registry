import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IDIDDocumentLite, DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IDIDDocument, Resolver } from '@ew-did-registry/did-resolver';
import { IClaim, IClaimData, IClaimBuildData } from '../models';

class Claim implements IClaim {
    /**
     * Used for creation of new Resolvers
     */
    protected readonly resolver: Resolver;

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
     * claimData stores the claim fields
     */
    public claimData: IClaimData;

    /**
     * keyPair represents the implementation of key management interface
     */
    public keyPair: IKeys;

    /**
     * Constructor
     *
     * IClaimBuildData has to be passed to construct any type of Claim
     * @param {IClaimBuildData} data
     */
    constructor(data: IClaimBuildData) {
      this.resolver = data.resolver;
      this.keyPair = data.keyPair;
      this.jwt = new JWT(data.keyPair);

      if (data.token === undefined) {
        const documentFactory = new DIDDocumentFactory(data.claimData.did);
        this.didDocumentLite = documentFactory.createLite(this.resolver);
        this.claimData = data.claimData;
      } else {
        this.token = data.token;
        const decodedPayload = this.jwt.decode(this.token);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (decodedPayload.did) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          const decodedDid = decodedPayload.did;
          const documentFactory = new DIDDocumentFactory(decodedDid);
          this.didDocumentLite = documentFactory.createLite(this.resolver);
          this.claimData = decodedPayload as IClaimData;
          this.claimData.signerDid = data.signerDid;
        }
      }
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
     * @returns {Promise<boolean>}
     */
    async getDid(did?: string): Promise<boolean> {
      try {
        if (did) {
          const tempResolver = new Resolver();
          const documentFactory = new DIDDocumentFactory(did);
          const tempDidDocumentLite = documentFactory.createLite(tempResolver);
          await tempDidDocumentLite.read(did);
          this.didDocument = tempDidDocumentLite.didDocument;
        } else {
          await this.didDocumentLite.read(this.claimData.did);
          this.didDocument = this.didDocumentLite.didDocument;
        }
        return true;
      } catch (error) {
        throw new Error(error);
      }
    }

    /**
     * Method creates token with the payload provided in the claim data
     * The signed token is stored as a member of Claim class
     * This is a void method
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
     * await publicClaim.createJWT();
     * console.log(publicClaim.token);
     * ```
     */
    async createJWT(): Promise<void> {
      this.token = await this.jwt.sign(this.claimData, { algorithm: 'ES256', noTimestamp: true });
    }
}

export default Claim;
