import { Claims } from '../claims';
import { IClaimsVerifier } from '../interface';
export declare class ClaimsVerifier extends Claims implements IClaimsVerifier {
    verifyPublicProof(token: string): Promise<boolean>;
    /**
     * Сhecks that the public keys in the `privateToken`'s payload matches values
     * based on which `this.token` payload was calculated
     * @example
     * ```typescript
     * import { ProofClaim } from '@ew-did-registry/claims';
     *
     * ------------------------------ owner -----------------------------------
     * const proofClaim = new ProofClaim({jwt, keys, claimData,  hashedFields });
     * const proofToken = proofClaim.token;
     * ----------------------------- verifier ---------------------------------
     * const proofClaim = new ProofClaim({jwt, keys, claimData, proofToken });
     * const privateToken = store.getClaim(claimUrl);
     * const verified = proofClaim.verify(privateToken);
     * ```
     * @param { string } privateToken
     */
    verifyPrivateProof(proofToken: string, privateToken: string): boolean;
}
