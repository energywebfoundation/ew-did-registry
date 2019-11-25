import { IPrivateClaim } from './private';
import { IProofClaim } from './proof';
import { ClaimType, IClaimData, IVerificationClaim } from './models';
/**
 * IClaims interface is a factory to create Public, Private, and Proof Claims
 */
export interface IClaims {
    /**
     * private members:
     * didDocument: IDidDocument
     * keyPair: IKeyPair;
     */
    /**
     * Create Public Claim with claim data
     * @param {IClaimData} data
     * @returns {IClaim}
     */
    createPublicClaim(data: IClaimData): IVerificationClaim;
    /**
     * Create Private Claim by providing claim data and Issuer's DID
     * @param {IClaimData} data
     * @param {string} didIssuer
     * @returns {IPrivateClaim}
     */
    createPrivateClaim(data: IClaimData, didIssuer: string): IPrivateClaim;
    /**
     * Create Proof Claim with claim data and hashed claim fields
     * @param {IClaimData} data
     * @param {number[]} hashedFields
     * @returns {IProofClaim}
     */
    createProofClaim(data: IClaimData, hashedFields: number[]): IProofClaim;
    /**
     * Provided with JWT this method will generate a Claim
     * @param {string} token
     * @param {ClaimType} type
     * @returns {IVerificationClaim | PrivateClaim | IProofClaim}
     */
    generateClaimFromToken(token: string, type: ClaimType): IVerificationClaim | IPrivateClaim | IProofClaim;
}
