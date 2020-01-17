import { IPrivateClaim, IClaimFields } from './interface';
import { VerificationClaim } from '../public';
import { IPrivateClaimBuildData } from '../models';
declare class PrivateClaim extends VerificationClaim implements IPrivateClaim {
    issuerDid: string;
    /**
     * Constructor takes as input Private Claim data.
     * eslint warning disabled to ensure type-checking.
     * @param data
     */
    constructor(data: IPrivateClaimBuildData);
    /**
     * Creation of Private Claim is a separate method to avoid asynchronous calls in the constructor
     *
     * @example
     * ```typescript
     * import { PrivateClaim } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * const keys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     *  did: `did:ewc:0x${keys.publicKey}`,
     *  issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
     *  test: 'test',
     * };
     *
     * const data = {
     *  jwt,
     *  keyPair: keys,
     *  claimData,
     * };
     * const privateClaim = new PrivateClaim(data);
     * await privateClaim.createPrivateClaimData();
     * console.log(privateClaim);
     * ```
     * @returns {Promise<{ [key: string]: string }}
     */
    createPrivateClaimData(): Promise<IClaimFields>;
    /**
     * This method is called when the issuer receives the token from the user with encrypted data
     *
     * @example
     * ```typescript
     * import { PrivateClaim } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * const keys = new Keys();
     * const issuerKeys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     * did: `did:ewc:0x${keys.publicKey}`,
     * issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
     *  test: 'test',
     * };
     * const data = {
     *  jwt,
     *  keyPair: keys,
     *  claimData,
     * };
     * const privateClaim = new PrivateClaim(data);
     * await privateClaim.createPrivateClaimData();
     *
     * const issuerJWT = new JWT(issuerKeys);
     * const issuerData = {
     *  jwt: issuerJWT,
     *  keyPair: issuerKeys,
     *  token: privateClaim.token,
     * }
     * const privateClaimIssuer = new PrivateClaim(issuerData);
     * privateClaimIssuer.decryptAndHashFields();
     * const hashedFields = privateClaimIssuer.claimData;
     * console.log(hashedFields);
     * ```
     *
     * @returns void
     */
    decryptAndHashFields(): void;
    /**
     * This method is called by the user after the issuer returns signed JWT with hashed
     * encrypted fields. Methods verifies if the payload was created correctly
     *
     * @example
     * ```typescript
     * import { PrivateClaim } from '@ew-did-registry/claims';
     * import { Keys } from '@ew-did-registry/keys';
     * import { JWT } from '@ew-did-registry/jwt';
     * const keys = new Keys();
     * const issuerKeys = new Keys();
     * const jwt = new JWT(keys);
     * const claimData = {
     * did: `did:ewc:0x${keys.publicKey}`,
     * issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
     *  test: 'test',
     * };
     * const data = {
     *  jwt,
     *  keyPair: keys,
     *  claimData,
     * };
     * const privateClaim = new PrivateClaim(data);
     * const saltedFields = await privateClaim.createPrivateClaimData();
     * privateClaim.decryptAndHashFields(issuerKeys.privateKey);
     * const issuerSignedToken = await issuerJWT.sign(privateClaim.claimData,
     * { algorithm: 'ES256', noTimestamp: true });
     * const issuerClaimData = {
     *  did: `did:ewc:0x${issuerKeys.publicKey}`,
     * };
     * const issuerData = {
     *  jwt,
     *  keyPair: keys,
     *  token: issuerSignedToken,
     *  claimData: issuerClaimData,
     * }
     * const issuerReturnedPrivateClaim = new PrivateClaim(issuerData);
     * issuerReturnedPrivateClaim.verify();
     * const verified = issuerReturnedPrivateClaim.verifyPayload(saltedFields);
     * console.log(verified);
     * ```
     *
     * @param {IClaimFields} saltedFields
     * @returns boolean
     */
    verifyPayload(saltedFields: IClaimFields): boolean;
}
export { IPrivateClaim, PrivateClaim, IClaimFields };
