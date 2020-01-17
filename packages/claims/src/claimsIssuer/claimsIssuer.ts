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
   * Approve method signs the payload of the provided token with verifiers private key
   * Returns signed token on success
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
   * const approvedToken = await verificationClaim.approve();
   * console.log(approvedToken)
   * // If verification was successful, verifier can sign the payload of the token
   * // with his private key and return the approved JWT
   * ```
   *
   * @returns {Promise<string>}
   */
  async issuePublicClaim(token: string): Promise<string> {
    // TODO check user signature
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    claim.signer = this.did;
    const signedToken = await this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true });
    return signedToken;
  }

  async issuePrivateClaim(token: string): Promise<string> {
    // TODO check user signature
    const curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;
    const g = curve.G;
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    claim.signer = this.did;
    Object.entries(claim.claimData).forEach(([key, value]) => {
      if (['did', 'signer'].includes(key)) return;
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      const decryptedField = decrypt(this.keys.privateKey, Buffer.from(value.data));
      const fieldHash = crypto.createHash('sha256').update(decryptedField).digest('hex');
      const PK = g.mult(new bn(fieldHash));
      claim.claimData[key] = PK.toBits();
    });
    return this.jwt.sign(claim, { algorithm: 'ES256', noTimestamp: true });
  }
}

export default ClaimsIssuer;
