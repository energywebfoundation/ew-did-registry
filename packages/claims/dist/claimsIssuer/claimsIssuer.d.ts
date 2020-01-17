import { IClaimsIssuer } from '../interface';
import { Claims } from '../claims';
export declare class ClaimsIssuer extends Claims implements IClaimsIssuer {
    /**
     * Approve method signs the payload of the provided token with verifiers private key
     * Returns signed token on success
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * import { verificationClaim } from '@ew-did-registry/claims';
     *
     * const keysVerifier = new Keys();
     * const jwtVerifier = new JWT(keysVerifier);
     * const tokenToVerify = publicClaim.token;
     * const dataVerifier = {
     *   jwt: jwtVerifier,
     *   keyPair: keysVerifier,
     *   token: tokenToVerify,
     * };
     *
     * verificationClaim = new VerificationClaim(dataVerifier);
     * const approvedToken = await verificationClaim.approve();
     * console.log(approvedToken)
     * // If verification was successful, verifier can sign the payload of the token
     * // with his private key and return the approved JWT
     * ```
     *
     * @returns {Promise<string>}
     */
    issuePublicClaim(token: string): Promise<string>;
    issuePrivateClaim(token: string): Promise<string>;
}
export default ClaimsIssuer;
