// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
// const sjcl = require('sjcl-complete');
import { Claim } from '../public';
import { IProofClaim } from './interface';
import { IProofClaimBuildData } from '../models';

const { bn, hash, codec } = sjcl;

export class ProofClaim extends Claim implements IProofClaim {
  /**
  * secp256k1 curve
  */
  curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;

  /**
   * prime order of the secp256k1 base
   */
  q = this.curve.r;

  /**
   * base of the secp256k1 curve
   */
  g = this.curve.G;

  paranoia = 6;

  /**
   * sha256-hashed private claim data
   */
  _hashedFields: { [keys: string]: string };

  /**
   * Creates claim about possession of some private data.
   * When created by the owner of the private data, this data must be contained
   * in `hashedFields`assosiative array. When created by verifier data must contain `token`
   * created during owner's creation of proof claim
   * @param { IProofClaimBuildData } data
   */
  constructor(data: IProofClaimBuildData) {
    super(data);
    if (data.hashedFields) { // claim created by subject - owner of the hashed fields
      this._hashedFields = data.hashedFields;
    } else { // claim created by verifier
      this.token = data.token;
    }
  }

  /* eslint-disable new-cap */
  async createProofClaimData(): Promise<void> {
    Object.entries(this._hashedFields).forEach(([key, field]) => {
      const k = bn.random(this.q, this.paranoia);
      const h: sjcl.SjclEllipticalPoint = this.curve.G.mult(k);
      const a = new bn(field);
      const PK = this.curve.G.mult(a);
      const c: sjcl.BigNumber = bn.fromBits(hash.sha256.hash(
        this.curve.G.x.toBits()
          .concat(h.toBits())
          .concat(PK.toBits()),
      ));
      const ca = c.mul(a).mod(this.q);
      const s = ca.add(k).mod(this.q);
      this.claimData[key] = { h: h.toBits(), s: s.toBits() };
    });
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
  verify(privateToken: string): boolean {
    let verified = true;
    const proofData = this.jwt.decode(this.token) as { [key: string]: { h: object; s: object } };
    const verifyData = this.jwt.decode(privateToken) as { [key: string]: string };
    const names = Object.keys(verifyData);
    names.forEach((name) => {
      const PK: sjcl.Point = this.curve.fromBits(codec.hex.toBits(verifyData[name]));
      const h = this.curve.fromBits(proofData[name].h);
      const s = bn.fromBits(proofData[name].s);
      let c = hash.sha256.hash(
        this.curve.G.x.toBits()
          .concat(h.toBits())
          .concat(PK.toBits()),
      );
      c = bn.fromBits(c);
      const left = this.curve.G.mult(s);
      const right = PK.mult(c).toJac().add(h).toAffine();
      if (!sjcl.bitArray.equal(left.toBits(), right.toBits())) {
        verified = false;
      }
    });
    return verified;
  }
}
