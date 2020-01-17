/* eslint-disable new-cap */
import { decrypt } from 'eciesjs';
import crypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import { IClaimsIssuer } from '../interface';
import { Claims } from '../claims';
import { IClaim } from '../models';

const { bn } = sjcl;
export class ClaimsIssuer extends Claims implements IClaimsIssuer {
  /**
   * Verifies user signature on token and issue new token signed by issuer.
   * Throws if user signature not valid
   *
   * @example
   * ```typescript
   * import { Keys } from '@ew-did-registry/keys';
   * import { ClaimsIssuer } from '@ew-did-registry/claims';
   *
   * const issuer = new Keys();
   * claims = new ClaimsIssuer(issuer);
   * const issuedToken = await claims.issuePublicClaim(token);
   * ```
   * @params { string } token to verify
   * @returns { Promise<string> } issued token
   */
  async issuePublicClaim(token: string): Promise<string> {
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    if (!(await this.verifySignature(token, claim.signer))) {
      throw new Error('User signature not valid');
    }
    claim.signer = this.did;
    const signedToken = await this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true });
    return signedToken;
  }

  /**
   * Verifies user signature on token, decrypt private data and issue new token
   * with sha256-hashed decrypted data signed by issuer. Throws if user
   * signature not valid
   *
   * @example
   * ```typescript
   * import { Keys } from '@ew-did-registry/keys';
   * import { ClaimsIssuer } from '@ew-did-registry/claims';
   *
   * const issuer = new Keys();
   * claims = new ClaimsIssuer(issuer);
   * const issuedToken = await claims.issuePrivateClaim(token);
   * ```
   * @params { string } token to verify
   * @returns { Promise<string> } issued token
   */
  async issuePrivateClaim(token: string): Promise<string> {
    const curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;
    const g = curve.G;
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    if (!(await this.verifySignature(token, claim.signer))) {
      throw new Error('User signature not valid');
    }
    claim.signer = this.did;
    Object.entries(claim.claimData).forEach(([key, value]) => {
      const decryptedField = decrypt(
        this.keys.privateKey,
        Buffer.from((value as { data: Array<number> }).data),
      );
      const fieldHash = crypto.createHash('sha256').update(decryptedField).digest('hex');
      const PK = g.mult(new bn(fieldHash));
      claim.claimData[key] = PK.toBits();
    });
    return this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true });
  }
}

export default ClaimsIssuer;
