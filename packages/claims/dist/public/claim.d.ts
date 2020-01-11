import { IJWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IDIDDocumentLite } from '@ew-did-registry/did-document';
import { IDIDDocument } from '@ew-did-registry/did-resolver';
import { IClaim, IClaimData, IClaimBuildData } from '../models';
declare class Claim implements IClaim {
    /**
     * Light document is used for fetching the DID Document
     */
    protected readonly didDocumentLite: IDIDDocumentLite;
    /**
     * didDocument is used to store fetched DID Document
     */
    didDocument: IDIDDocument;
    /**
     * jwt stores the JWT to manage web tokens
     */
    jwt: IJWT;
    /**
     * claimToken stores the actual serialised JWT in a string format
     */
    token: string;
    /**
     * claimData stores the claim fields
     */
    claimData: IClaimData;
    /**
     * keyPair represents the implementation of key management interface
     */
    keyPair: IKeys;
    /**
     * Constructor
     *
     * Settings have to be passed to construct resolver
     * @param {IResolverSettings} settings
     */
    constructor(data: IClaimBuildData);
    getDid(): Promise<boolean>;
    createJWT(): Promise<void>;
}
export default Claim;
