import Claim from './claim';
import { IVerificationClaim } from '../models';
declare class VerificationClaim extends Claim implements IVerificationClaim {
    /**
     * Verify method checks if the token was signed by the correct private key
     * Returns true on success
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
     * const verified = await verificationClaim.verify();
     * console.log(verified) // Should be true, if successful
     * ```
     *
     * @returns {Promise<boolean>}
     */
    verify(): Promise<boolean>;
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
    approve(): Promise<string>;
}
export default VerificationClaim;
