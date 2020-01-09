import { IVerificationClaim } from '../models';

/**
 * This interface extends a more general Verification Claim interface
 * and specifies Private Claim interface, which is used to generate and
 * verify Private Claims
 */
export interface IPrivateClaim extends IVerificationClaim {

    /**
     * Constructor for Private Claims take IPrivateClaimBuildData, which includes issuer DID
     * constructor(data: IPrivateClaimBuildData);
     */

    /**
     * To verify that the Issuer constructed the JWT correctly, hashed claim fields are provided
     * @param {number[]} hashedFields
     * @returns {boolean}
     */
    verifyPayload(hashedFields: { [key: string]: string }): boolean;
}
