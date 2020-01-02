import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IDIDDocumentLite, DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IDIDDocument, Resolver } from '@ew-did-registry/did-resolver';
import {
  IClaim, IClaimData, IClaimBuildData, IVerificationClaim,
} from '../models';

class Claim implements IClaim {
    /**
     * Light document is used for fetching the DID Document
     */
    protected readonly didDocumentLite: IDIDDocumentLite;

    /**
     * didDocument is used to store fetched DID Document
     */
    protected didDocument: IDIDDocument;

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
      this.didDocumentLite = DIDDocumentFactory.createLite(resolver);
      this.keyPair = data.keyPair;
      this.jwt = new JWT(data.keyPair);
      this.claimData = data.claimData;
      this._createJWT(this.jwt, data.claimData).then((token) => {
        this.token = token;
      });
    }

    async getDid(): Promise<boolean> {
      try {
        await this.didDocumentLite.read(this.claimData.did);
        this.didDocument = this.didDocumentLite.didDocument;
        return true;
      } catch (error) {
        return false;
      }
    }

    private async _createJWT(jwt: IJWT, claimData: IClaimData) {
      const token = await jwt.sign(claimData);
      return token;
    }
}

export default Claim;
