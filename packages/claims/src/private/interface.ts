import { IVerificationClaim } from '../models';

/**
 * Interface stored salted fields used during the creation of Private Claims
 */
export interface IClaimFields {
    [key: string]: string;
}

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
     *
     * @param {number[]} hashedFields
     * @returns {boolean}
     */
    verifyPayload(hashedFields: IClaimFields): boolean;

    /**
     * Method creates the salted and encrypted Private Claim Data required by the user
     * and sent to the issuer
     *
     * @returns {Promise<IClaimFields>}
     */
    createPrivateClaimData(): Promise<IClaimFields>;

    /**
     * Method is called by the issuer. It decrypts the claim data sent by user
     * and then encrypts again according to the protocol
     *
     * @param {string} privateKey
     * @returns {void}
     */
    decryptAndHashFields(): void;
}
