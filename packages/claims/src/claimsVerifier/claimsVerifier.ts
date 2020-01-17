// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import { Claims } from '../claims';
import { IClaimsVerifier } from '../interface';
import { IClaim } from '../models';

const { bn, hash } = sjcl;

export class ClaimsVerifier extends Claims implements IClaimsVerifier {
  /**
   * Checks issuer signature on token
   *
   * @example
   * ```typescript
   * import { ClaimsVerifier } from '@ew-did-registry/claims';
   * import { Keys } from '@ew-did-registry/keys';
   *
   * const keys = new Keys();
   * const claims = new ClaimsVerifier(verifier);
   * const verified = claims.verifyPublicProof(issuedToken);
   * ```
   * @param { string } token containing proof data
   * @returns { boolean } whether the proof was succesfull
   */
  async verifyPublicProof(token: string): Promise<boolean> {
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    if (!(await this.verifySignature(token, claim.signer))) return false;
    // TODO check signer is delegate of did
    return true;
  }

  /**
  * Checks issuer signature on issued token and user signature on proof token
  * and verifies that proof and private data mathches to each other
  *
  * @example
  * ```typescript
  * import { ClaimsVerifier } from '@ew-did-registry/claims';
  * import { Keys } from '@ew-did-registry/keys';
  *
  * const keys = new Keys();
  * const claims = new ClaimsVerifier(verifier);
  * const verified = claims.verifyPrivateProof(proofToken, privateToken);
  * ```
  * @param { string } proofToken contains proof data
  * @param { string } privateToken contains private data
  * @returns { boolean } whether the proof was succesfull
  */
  async verifyPrivateProof(proofToken: string, privateToken: string): Promise<boolean> {
    const curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;
    const g = curve.G;
    const proofClaim: IClaim = this.jwt.decode(proofToken) as IClaim;
    if (!(await this.verifySignature(proofToken, proofClaim.signer))) return false;
    const privateClaim: IClaim = this.jwt.decode(privateToken) as IClaim;
    if (!(await this.verifySignature(privateToken, privateClaim.signer))) return false;
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(privateClaim.claimData)) {
      const PK = curve.fromBits(value);
      let { h, s } = proofClaim.claimData[key] as { h: sjcl.bitArray; s: sjcl.bitArray };
      h = curve.fromBits(h);
      s = bn.fromBits(s);
      let c = hash.sha256.hash(
        g.x.toBits()
          .concat(h.toBits())
          .concat(PK.toBits()),
      );
      c = bn.fromBits(c);
      const left = g.mult(s);
      const right = PK.mult(c).toJac().add(h).toAffine();
      if (!sjcl.bitArray.equal(left.toBits(), right.toBits())) {
        return false;
      }
    }
    return true;
  }
}
