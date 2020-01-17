import sjcl from 'sjcl-complete';
import { IClaimData } from '../models';
import { IClaimsUser } from '../interface';
import { Claims } from '../claims';
declare class ClaimsUser extends Claims implements IClaimsUser {
    curve: sjcl.SjclEllipticalCurve;
    q: any;
    g: any;
    paranoia: number;
    /**
     *
     * Creates verifiable claim with data about subject provided in claimData
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const subject = new Keys();
     * const claims = new Claims(subject);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:claim_subject_address',
     *     data: 'data'
     * };
     * const claim = await claims.createPublicClaim(claimData);
     * ```
     * @param { IClaimData } claimData
     *
     * @returns { Promise<IVerificationClaim> }
     */
    createPublicClaim(claimData: IClaimData): Promise<string>;
    /**
     * Used by the claim subject to create token with subject encrypted
     * private data which afterwards will be sent to the issuer. Salted private
     * fields will be saved in the `saltedFields` argument
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const subject = new Keys();
     * const claims = new Claims(subject);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:claim_subject_address',
     *     secret: '123'
     * };
     * const issuerDid = 'did:Networks.Ethereum:issuer_address';
     * const claim = await claims.createPrivateClaim(claimData, issuerDid);
     * ```
     * @param { IClaimData } claimData object with claim subject `did` and subject private data
     * @param { string } issuerDid
     *
     * @returns { Promise<IPrivateClaim> } claim wich contains token with private data encrypted by issuer key
     */
    createPrivateClaim(claimData: IClaimData, issuer: string): Promise<{
        token: string;
        saltedFields: {
            [key: string]: string;
        };
    }>;
    /**
     * Used by the claim subject based on the hashed salted values calculated
     * when creating private claim. Verifier should use `generateClaimFromToken`
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const subject = new Keys();
     * const claims = new Claims(subject);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:claim_subject_address',
     * };
     * const hashedFields = {
     *    secret: '0x500cec0cbd1888723f3438b2bdcb8b6b399cefefd25809231bed2c5bcb2aef88'
     * };
     * const claim = await claims.createProofClaim(claimData, hashedFields);
     * ```
     * @param { IClaimData } claimData - claim subject public data
     * @param { { [keys: string]: string } } hashedFields - salted and sha256-hashed private subject data
     *
     * @returns { Promise<IPrivateClaim> }
     */
    createProofClaim(claimUrl: string, saltedFields: {
        [key: string]: string;
    }): Promise<string>;
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
    verifyPublicClaim(token: string): Promise<boolean>;
    verifyPrivateClaim(token: string, saltedFields: {
        [key: string]: string;
    }): Promise<boolean>;
}
export default ClaimsUser;
