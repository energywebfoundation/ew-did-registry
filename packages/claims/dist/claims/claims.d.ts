import { IResolver, IDIDDocument } from '@ew-did-registry/did-resolver';
import { IDIDDocumentLite } from '@ew-did-registry/did-document';
import { IJWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IClaims } from '../models';
export declare class Claims implements IClaims {
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
     * keyPair represents the implementation of key management interface
     */
    keys: IKeys;
    did: string;
    /**
     * Constructor
     *
     * IClaimBuildData has to be passed to construct any type of Claim
     * @param {IClaimBuildData} data
     */
    constructor(keys: IKeys, resolver: IResolver);
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
    getDocument(did: string): Promise<IDIDDocument>;
    verifySignature(token: string, signer: string): Promise<boolean>;
}
