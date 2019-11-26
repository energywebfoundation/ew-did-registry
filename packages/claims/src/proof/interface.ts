import { IClaim } from '../models';

/**
 * This interface extends a more general Claim interface
 * and specifies Proof interface, which is used to create
 * proof of knowledge of claim data and provides a method
 * to verify if the provided proof is valid
 */
export interface IProofClaim extends IClaim {

    /**
     * To construct a Proof Claim one has to prove IProofClaimBuildData objects
     * constructor(data: IProofClaimBuildData);
     */

    /**
     * To verify the claim, private token (JWT) representing the claim should be provided
     * @param {string} privateToken
     * @returns {boolean}
     */
    verify(privateToken: string): boolean;
}
