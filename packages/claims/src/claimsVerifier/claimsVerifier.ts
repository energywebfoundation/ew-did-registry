// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import { Claims } from '../claims';
import { IClaimsVerifier } from '../interface';
import { IClaim } from '../models';

const { bn, hash } = sjcl;

export class ClaimsVerifier extends Claims implements IClaimsVerifier {
  async verifyPublicProof(token: string): Promise<boolean> {
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    if (!(await this.verifySignature(token, claim.signer))) return false;
    // TODO check signer is delegate of did
    return true;
  }

  /**
   * Сhecks that the public keys in the `privateToken`'s payload matches values
   * based on which `this.token` payload was calculated
   * @example
   * ```typescript
   * import { ProofClaim } from '@ew-did-registry/claims';
   *
   * ------------------------------ owner -----------------------------------
   * const proofClaim = new ProofClaim({jwt, keys, claimData,  hashedFields });
   * const proofToken = proofClaim.token;
   * ----------------------------- verifier ---------------------------------
   * const proofClaim = new ProofClaim({jwt, keys, claimData, proofToken });
   * const privateToken = store.getClaim(claimUrl);
   * const verified = proofClaim.verify(privateToken);
   * ```
   * @param { string } privateToken
   */
  verifyPrivateProof(proofToken: string, privateToken: string): boolean {
    const curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;
    const g = curve.G;
    const proofClaim: IClaim = this.jwt.decode(proofToken) as IClaim;
    const privateClaim: IClaim = this.jwt.decode(privateToken) as IClaim;
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
