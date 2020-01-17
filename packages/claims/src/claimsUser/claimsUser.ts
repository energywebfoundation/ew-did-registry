/* eslint-disable new-cap */
/* eslint-disable max-len */
import crypto from 'crypto';
import { encrypt } from 'eciesjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import {
  IClaimData, IClaim, IProofClaim,
} from '../models';
import { IClaimsUser } from '../interface';
import { Claims } from '../claims';

const { bn, hash, bitArray } = sjcl;

class ClaimsUser extends Claims implements IClaimsUser {
  curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;

  q = this.curve.r;

  g = this.curve.G;

  paranoia = 6;

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
  async createPublicClaim(claimData: IClaimData): Promise<string> {
    const claim: IClaim = {
      did: this.did,
      signer: this.did,
      claimData,
    };
    return this.jwt.sign(claim);
  }

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
  async createPrivateClaim(
    claimData: IClaimData,
    issuerPK: string,
  ): Promise<{ token: string; saltedFields: { [key: string]: string } }> {
    const saltedFields = {};
    const claim: IClaim = {
      did: this.did,
      signer: this.did,
      claimData: {},
    };
    Object.entries(claimData).forEach(([key, value]) => {
      const salt = crypto.randomBytes(32).toString('base64');
      const saltedValue = value + salt;
      const encryptedValue = encrypt(issuerPK, Buffer.from(saltedValue));
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      claim.claimData[key] = encryptedValue;
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      saltedFields[key] = saltedValue;
    });
    const token = await this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true });
    return { token, saltedFields };
  }

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
  async createProofClaim(claimUrl: string, saltedFields: { [key: string]: string }): Promise<string> {
    const claim: IProofClaim = {
      did: this.did,
      signer: this.did,
      claimUrl,
      claimData: {},
    };
    Object.entries(saltedFields).forEach(([key, field]) => {
      const k = bn.random(this.q, this.paranoia);
      const h: sjcl.SjclEllipticalPoint = this.g.mult(k);
      const hashedField = crypto.createHash('sha256').update(field).digest('hex');
      const a = new bn(hashedField);
      const PK = this.g.mult(a);
      const c: sjcl.BigNumber = bn.fromBits(hash.sha256.hash(
        this.g.x.toBits()
          .concat(h.toBits())
          .concat(PK.toBits()),
      ));
      const ca = c.mul(a).mod(this.q);
      const s = ca.add(k).mod(this.q);
      claim.claimData[key] = { h: h.toBits(), s: s.toBits() };
    });
    return this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true });
  }

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
  async verifyPublicClaim(token: string): Promise<boolean> {
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    return this.verifySignature(token, claim.signer);
    // TODO: add signer to delegates
  }

  async verifyPrivateClaim(token: string, saltedFields: { [key: string]: string }): Promise<boolean> {
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    if (!(await this.verifySignature(token, claim.signer))) return false;
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(saltedFields)) {
      const fieldHash = crypto.createHash('sha256').update(value).digest('hex');
      const PK = this.g.mult(new bn(fieldHash));
      if (!bitArray.equal(claim.claimData[key], PK.toBits())) {
        return false;
      }
    }
    // TODO: add signer to delegates
    return true;
  }
}

export default ClaimsUser;
