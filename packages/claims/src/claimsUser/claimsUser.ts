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

export class ClaimsUser extends Claims implements IClaimsUser {
  curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;

  q = this.curve.r;

  g = this.curve.G;

  paranoia = 6;

  /**
   *
   * Creates token with data about subject provided in claimData
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new ClaimsUser(user);
   * const claimData = {
   *     name: 'John'
   * };
   * const token = await claims.createPublicClaim(claimData);
   * ```
   * @param { IClaimData } claimData
   *
   * @returns { Promise<string> }
   */
  async createPublicClaim(claimData: IClaimData): Promise<string> {
    const claim: IClaim = {
      did: this.did,
      signer: this.did,
      claimData,
    };
    return this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true });
  }

  /**
   * Used by the claim subject to create token with subject encrypted
   * private data which afterwards will be sent to the issuer. Salted private
   * fields will be saved in the `saltedFields` argument
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new ClaimsUser(user);
   * const claimData = {
   *     secret: '123'
   * };
   * const claim = await claims.createPrivateClaim(claimData, issuer);
   * ```
   * @param { IClaimData } claimData object with claim subject private data
   * @param { string } issuer
   *
   * @returns { Promise<{token: string, saltedFields:{ [key: string]: string }}> } token with private data encrypted by issuer key
   */
  async createPrivateClaim(
    claimData: IClaimData,
    issuer: string,
  ): Promise<{ token: string; saltedFields: { [key: string]: string } }> {
    const saltedFields: { [key: string]: string } = {};
    const claim: IClaim = {
      did: this.did,
      signer: this.did,
      claimData: {},
    };
    const issuerDocument = await this.getDocument(issuer);
    const issuerPK = issuerDocument
      .publicKey
      .find((pk: { type: string }) => pk.type === 'Secp256k1veriKey')
      .publicKeyHex;
    Object.entries(claimData).forEach(([key, value]) => {
      const salt = crypto.randomBytes(32).toString('base64');
      const saltedValue = value + salt;
      const encryptedValue = encrypt(issuerPK, Buffer.from(saltedValue));
      claim.claimData[key] = encryptedValue;
      saltedFields[key] = saltedValue;
    });
    const token = await this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true });
    return { token, saltedFields };
  }

  /**
   * Used by the claim subject based on the salted values calculated
   * when creating private claim
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new ClaimsUser(user);
   * const claimUrl = 'http://example.com';
   * const saltedFields = {
   *    secret: '123abc'
   * };
   * const claim = await claims.createProofClaim(claimUrl, saltedFields);
   * ```
   * @param { string } claimUrl - url of previously saved token
   * @param { { [keys: string]: string } } saltedFields - salted private user data
   *
   * @returns { Promise<string> }
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
   * Verifies token received from issuer
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new UserClaims(user);
   * const verified = await claims.verifyPublicToken(issuedToken);
   * ```
   * @param { string } token - issued token
   * @returns {Promise<boolean>}
   */
  async verifyPublicClaim(token: string): Promise<boolean> {
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    return this.verifySignature(token, claim.signer);
    // TODO: add signer to delegates
  }

  /**
   * Verifies token with private data received from issuer
   *
   * @example
   * ```typescript
   * import { ClaimsUser } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const user = new Keys();
   * const claims = new UserClaims(user);
   * const verified = await claims.verifyPrivateToken(issuedToken);
   * ```
   * @param { string } token - issued token
   * @returns {Promise<boolean>}
   */
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
