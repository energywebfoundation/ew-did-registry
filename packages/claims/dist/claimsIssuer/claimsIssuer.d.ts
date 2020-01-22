import { IClaimsIssuer } from '../interface';
import { Claims } from '../claims';
export declare class ClaimsIssuer extends Claims implements IClaimsIssuer {
    /**
     * Verifies user signature on token and issue new token signed by issuer./
     * Throws if user signature not valid
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { ClaimsIssuer } from '@ew-did-registry/claims';
     *
     * const issuer = new Keys();
     * claims = new ClaimsIssuer(issuer);
     * const issuedToken = await claims.issuePublicClaim(token);
     * ```
     * @params { string } token to verify
     * @returns { Promise<string> } issued token
     */
    issuePublicClaim(token: string): Promise<string>;
    /**
     * Verifies user signature on token, decrypt private data and issue new token
     * with sha256-hashed decrypted data signed by issuer. Throws if user
     * signature not valid
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { ClaimsIssuer } from '@ew-did-registry/claims';
     *
     * const issuer = new Keys();
     * claims = new ClaimsIssuer(issuer);
     * const issuedToken = await claims.issuePrivateClaim(token);
     * ```
     * @params { string } token to verify
     * @returns { Promise<string> } issued token
     */
    issuePrivateClaim(token: string): Promise<string>;
}
export default ClaimsIssuer;
