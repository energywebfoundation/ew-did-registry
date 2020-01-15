import { IJWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IDIDDocumentLite } from '@ew-did-registry/did-document';
import { IDIDDocument } from '@ew-did-registry/did-resolver';
import { IClaim, IClaimData, IClaimBuildData } from '../models';
declare class Claim implements IClaim {
    /**
     * Used for creation of new Resolvers
     */
    private readonly resolver;
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
     * IClaimBuildData has to be passed to construct any type of Claim
     * @param {IClaimBuildData} data
     */
    constructor(data: IClaimBuildData);
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
    getDid(did?: string): Promise<boolean>;
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
    createJWT(): Promise<void>;
}
export default Claim;
