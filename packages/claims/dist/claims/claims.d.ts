import { IKeys } from '@ew-did-registry/keys';
import { IPrivateClaim } from '../private';
import { ClaimType, IClaimData, IVerificationClaim } from '../models';
import { IProofClaim } from '../proof';
import { IClaims } from '../interface';
export declare class Claims implements IClaims {
    /**
     * Did document describing the subject for which this factory creates the claims
     */
    private _didDocument;
    /**
     * Subject keypair
     */
    private readonly _keyPair;
    /**
     *
     * @param {IKeys} keyPair
     * @param {IDidDocumetn} didDocument
     */
    constructor(keyPair: IKeys);
    /**
     * Creates verifiable claim with data about subject provided in claimData
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const claims = new Claims(keys);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:my_id',
     *     data: 'data'
     * };
     * const claim = await claims.createPublicClaim(claimData);
     * ```
     * @param {IClaimData } claimData
     *
     * @return {Promise<IVerificationClaim>}
     */
    createPublicClaim(claimData: IClaimData): Promise<IVerificationClaim>;
    /**
     * Creates claim which will be sent in encoded form to the didIssuer
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const claims = new Claims(keys);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:my_id',
     *     data: 'secret data'
     * };
     * const didIssuer = 'did:Networks.Ethereum:issuer_id';
     * const claim = await claims.createPrivateClaim(claimData, didIssuer);
     * ```
     * @param {IClaimData } claimData
     * @param {string} didIssuer
     *
     * @return {Promise<IPrivateClaim>}
     */
    createPrivateClaim(claimData: IClaimData, didIssuer: string): Promise<IPrivateClaim>;
    /**
     * Creates claim with verifiable data in hashedFields
     *
     * @example
     * ```typescript
     * import { Claims } from '@ew-did-registry/claims';
     * import { Networks } from '@ew-did-registry/did';
     *
     * const claims = new Claims(keys);
     * const claimData = {
     *     did: 'did:Networks.Ethereum:my_id',
     *     data: 'secret data'
     * };
     * const hashedFields = [123, 456];
     * const claim = await claims.createProofClaim(claimData, hashedFields);
     * ```
     * @param {IClaimData } claimData
     * @param {number[]} hashedFields
     *
     * @return {Promise<IPrivateClaim>}
     */
    createProofClaim(claimData: IClaimData, hashedFields: {
        [keys: string]: string;
    }): Promise<IProofClaim>;
    /**
     * Creates claim of the specified type from the serialized claim
     *
     * @example
     * ```typescript
     * import { Claims, ClaimType } from '@ew-did-registry/claims';
     *
     * const keys = new Keys();
     * const claims = new Claims(keys);
     * const claim = claims.generateClaimFromToken(
     * ```
     *
     * @param { string } token
     * @param { ClaimType } type
     *
     * @return Promise<IVerificationClaim | IPrivateClaim | IProofClaim>
     */
    generateClaimFromToken(token: string, type: ClaimType): Promise<IVerificationClaim | IPrivateClaim | IProofClaim>;
}
