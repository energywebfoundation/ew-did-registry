import { IDIDDocument } from '@ew-did-registry/did-resolver';
import { IKeys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';
import { IPrivateClaim, PrivateClaim } from '../private';
import { ClaimType, IClaimData, IVerificationClaim } from '../models';
import { IProofClaim, ProofClaim } from '../proof';
import { VerificationClaim } from '../public';
import { IClaims } from '../interface';

export class Claims implements IClaims {
  /**
   * Did document describing the subject for which this factory creates the claims
   */
  private _didDocument: IDIDDocument;

  /**
   * Subject keypair
   */
  private readonly _keyPair: IKeys;

  /**
   *
   * @param {IKeys} keyPair
   * @param {IDidDocumetn} didDocument
   */
  constructor(keyPair: IKeys) {
    this._keyPair = keyPair;
  }

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
  async createPublicClaim(claimData: IClaimData): Promise<IVerificationClaim> {
    const jwt = new JWT(this._keyPair);
    const token = await jwt.sign(claimData);
    return new VerificationClaim({
      jwt,
      keyPair: this._keyPair,
      token,
    });
  }

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
  async createPrivateClaim(claimData: IClaimData, didIssuer: string): Promise<IPrivateClaim> {
    const jwt = new JWT(this._keyPair);
    const token = await jwt.sign(claimData);
    return new PrivateClaim({
      jwt,
      keyPair: this._keyPair,
      token,
      issuerDid: didIssuer,
    });
  }

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
  // eslint-disable-next-line max-len
  async createProofClaim(claimData: IClaimData, hashedFields: { [keys: string]: string }): Promise<IProofClaim> {
    const jwt = new JWT(this._keyPair);
    const token = await jwt.sign(claimData);
    return new ProofClaim({
      jwt,
      keyPair: this._keyPair,
      token,
      hashedFields,
    });
  }

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
  async generateClaimFromToken(token: string, type: ClaimType):
    Promise<IVerificationClaim | IPrivateClaim | IProofClaim> {
    const jwt = new JWT(this._keyPair);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const { claimData, hashedFields, didIssuer } = await jwt.decode(token);
    switch (type) {
      case ClaimType.Public:
        return this.createPublicClaim(claimData);
      case ClaimType.Private:
        return this.createPrivateClaim(claimData, hashedFields);
      case ClaimType.Proof:
        return this.createProofClaim(claimData, didIssuer);
      default:
        return this.createPublicClaim(claimData);
    }
  }
}
