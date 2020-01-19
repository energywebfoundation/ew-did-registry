import { IResolver, IDIDDocument } from '@ew-did-registry/did-resolver';
import { IJWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IClaims } from '../models';
/**
 * @class
 * Base class for extending by other claims classes
 */
export declare class Claims implements IClaims {
    /**
     * Used for creation of new Resolvers
     */
    private readonly resolver;
    /**
     * jwt stores the JWT to manage web tokens
     */
    jwt: IJWT;
    /**
     * Key pair represents the implementation of key management interface
     */
    keys: IKeys;
    did: string;
    /**
     * @constructor
     *
     * @param { IKeys } keys user key pair
     * @param { IResolver } resolver
     */
    constructor(keys: IKeys, resolver: IResolver);
    /**
     * Fetches DID document of the corresponding DID
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { Claims } from '@ew-did-registry/claims';
     *
     * const user = new Keys();
     * const claims = new Claims(user);
     * const did = `did:${Networks.Ethereum}:user_id`;
     * const document = await claims.getDocument(did);
     * ```
     *
     * @returns {Promise<IDIDDocument>}
     */
    getDocument(did: string): Promise<IDIDDocument>;
    /**
     * Verifies signers signature on received token
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { Claims } from '@ew-did-registry/claims';
     *
     * const user = new Keys();
     * const claims = new Claims(user);
     * const verified = claims.verifySignature(token, userDid);
     * ```
     *
     * @param { string } token token signature on which you want to check
     * @param { string } signer did of the signer
     */
    verifySignature(token: string, signer: string): Promise<boolean>;
}
