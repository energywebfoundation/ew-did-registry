import sjcl from 'sjcl-complete';
import { IClaimData } from '../models';
import { IClaimsUser } from '../interface';
import { Claims } from '../claims';
export declare class ClaimsUser extends Claims implements IClaimsUser {
    curve: sjcl.SjclEllipticalCurve;
    q: any;
    g: any;
    paranoia: number;
    /**
     *
     * Creates token with data about subject provided in claimData
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new ClaimsUser(user);
     * const claimData = {
     *     name: 'John'
     * };
     * const token = await claims.createPublicClaim(claimData);
     * ```
     * @param { IClaimData } publicData
     *
     * @returns { Promise<string> }
     */
    createPublicClaim(publicData: IClaimData): Promise<string>;
    /**
     * Used by the claim subject to create token with subject encrypted
     * private data which afterwards will be sent to the issuer. Salted private
     * fields will be saved in the `saltedFields` argument
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new ClaimsUser(user);
     * const claimData = {
     *     secret: '123'
     * };
     * const claim = await claims.createPrivateClaim(claimData, issuer);
     * ```
     * @param { IClaimData } publicData object with claim subject private data
     * @param { string } issuer
     *
     * @returns { Promise<{token: string, saltedFields:{ [key: string]: string }}> } token with private data encrypted by issuer key
     */
    createPrivateClaim(publicData: IClaimData, privateData: IClaimData, issuer: string): Promise<{
        token: string;
        saltedFields: {
            [key: string]: string;
        };
    }>;
    /**
     * Used by the claim subject based on the salted values calculated
     * when creating private claim
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new ClaimsUser(user);
     * const claimUrl = 'http://example.com';
     * const saltedFields = {
     *    secret: '123abc'
     * };
     * const claim = await claims.createProofClaim(claimUrl, saltedFields);
     * ```
     * @param { string } claimUrl - url of previously saved token
     * @param { { [keys: string]: string } } saltedFields - salted private user data
     *
     * @returns { Promise<string> }
     */
    createProofClaim(claimUrl: string, saltedFields: {
        [key: string]: string;
    }): Promise<string>;
    /**
     * Verifies token received from issuer
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new UserClaims(user);
     * const verified = await claims.verifyPublicToken(issuedToken);
     * ```
     * @param { string } token - issued token
     * @returns {Promise<void>}
     * @throws if the proof failed
     */
    verifyPublicClaim(token: string, verifyData: IClaimData): Promise<void>;
    /**
     * Verifies token with private data received from issuer
     *
     * @example
     * ```typescript
     * import { ClaimsUser } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const user = new Keys();
     * const claims = new UserClaims(user);
     * const verified = await claims.verifyPrivateToken(issuedToken);
     * ```
     * @param { string } token - issued token
     * @returns {Promise<void>}
     * @throw if the proof failed
     */
    verifyPrivateClaim(token: string, saltedFields: {
        [key: string]: string;
    }, publicData: IClaimData): Promise<void>;
}
