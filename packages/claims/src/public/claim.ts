import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IDIDDocumentLite, DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IDIDDocument, Resolver } from '@ew-did-registry/did-resolver';
import { IClaim, IClaimData, IClaimBuildData } from '../models';

class Claim implements IClaim {
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
      const resolver = new Resolver(data.resolverSettings);
      this.keyPair = data.keyPair;
      this.jwt = new JWT(data.keyPair);

      if (data.token === undefined) {
        const documentFactory = new DIDDocumentFactory(data.claimData.did);
        this.didDocumentLite = documentFactory.createLite(resolver);
        this.claimData = data.claimData;
      } else {
        this.token = data.token;
        const decodedPayload = this.jwt.decode(this.token);
        if (Object.prototype.hasOwnProperty.call(decodedPayload, 'did')) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          const decodedDid = decodedPayload.did;
          const documentFactory = new DIDDocumentFactory(decodedDid);
          this.didDocumentLite = documentFactory.createLite(resolver);
          this.claimData = {
            did: decodedDid,
          };
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
    async getDid(): Promise<boolean> {
      try {
        await this.didDocumentLite.read(this.claimData.did);
        this.didDocument = this.didDocumentLite.didDocument;
        return true;
      } catch (error) {
        console.log(error);
        return false;
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
    async createJWT() {
      const token = await this.jwt.sign(this.claimData, { algorithm: 'ES256', noTimestamp: true });
      this.token = token;
    }
}

export default Claim;
