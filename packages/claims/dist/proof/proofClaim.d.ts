import sjcl from 'sjcl-complete';
import { Claim } from '../public';
import { IProofClaim } from './interface';
import { IProofClaimBuildData } from '../models';
export declare class ProofClaim extends Claim implements IProofClaim {
    /**
    * secp256k1 curve
    */
    curve: sjcl.SjclEllipticalCurve;
    /**
     * prime order of the secp256k1 base
     */
    q: any;
    /**
     * base of the secp256k1 curve
     */
    g: any;
    paranoia: number;
    /**
     * token creation completion flag
     */
    tokenCreated: Promise<void>;
    /**
     * Creates claim about possession of some private data.
     * When created by the owner of the private data, this data must be contained
     * in `hashedFields`assosiative array. When created by verifier data must contain `token`
     * created during owner's creation of proof claim
     * @param { IProofClaimBuildData } data
     */
    constructor(data: IProofClaimBuildData);
    private _createToken;
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
    verify(privateToken: string): boolean;
}
