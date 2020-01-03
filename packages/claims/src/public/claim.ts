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
     * Settings have to be passed to construct resolver
     * @param {IResolverSettings} settings
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

    async createJWT() {
      const token = await this.jwt.sign(this.claimData, { algorithm: 'ES256', noTimestamp: true });
      this.token = token;
    }
}

export default Claim;
