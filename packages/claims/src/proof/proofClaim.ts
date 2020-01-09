// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import { Claim } from '../public';
import { IProofClaim } from './interface';
import { IProofClaimBuildData } from '../models';

const { bn, hash } = sjcl;
export class ProofClaim extends Claim implements IProofClaim {
  /**
   * hashed private values
   */
  _hashedFields: number[];

  curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;

  q = this.curve.r;

  paranoia = 6;

  tokenCreated: Promise<void>;

  constructor(data: IProofClaimBuildData) {
    super(data);
    if (data.hashedFields) { // claim created by subject - owner of the hashed fields
      this.tokenCreated = this._createToken(data.hashedFields);
    } else { // claim created by verifier
      this.token = data.token;
    }
  }

  // TODO check that the hashed fields are in the range of 1 to q
  // TODO change type of hashedFields to BitArray[]
  /* eslint-disable new-cap */
  private async _createToken(hashedFields: number[]): Promise<void> {
    const proofData = hashedFields.map((a) => {
      const k = bn.random(this.q, this.paranoia);
      const h: sjcl.Point = this.curve.G.mult(k);
      const PK = this.curve.G.mult(bn.fromBits(a));
      let c = hash.sha256.hash(
        this.curve.G.x.toBits()
          .concat(h.toBits())
          .concat(PK.toBits()),
      );
      c = bn.fromBits(c);
      const ca = c.mul(bn.fromBits(a)).mod(this.q);
      const s = ca.add(k).mod(this.q);
      // const s = k.sub(ca).mod(this.q);
      return { h: h.toBits(), s: s.toBits() };
    });
    /* eslint-disable new-cap */
    this.token = await this.jwt.sign(JSON.stringify(proofData));
  }

  /**
   * Сhecks that the public keys in the private token payload matches the values based on
   * which the this.token payload was calculated
   * @param { string } privateToken
   */
  verify(privateToken: string): boolean {
    let verified = true;
    const proofData = this.jwt.decode(this.token) as any;
    const payload = this.jwt.decode(privateToken) as { [key: string]: object };
    const verifyData = payload.verifyData as { [keys: string]: string };
    const names = Object.keys(verifyData);
    names.forEach((name, index) => {
      const PK: sjcl.Point = this.curve.fromBits(verifyData[name]);
      const h = this.curve.fromBits(proofData[index].h);
      const s = bn.fromBits(proofData[index].s);
      let c = hash.sha256.hash(
        this.curve.G.x.toBits()
          .concat(h.toBits())
          .concat(PK.toBits()),
      );
      c = bn.fromBits(c);
      const left = this.curve.G.mult(s);
      const right = PK.mult(c).toJac().add(h).toAffine();
      // const left = h;
      // const right = this.curve.G.mult(s).toJac().add(PK.mult(c)).toAffine();
      if (!sjcl.bitArray.equal(left.toBits(), right.toBits())) {
        verified = verified && false;
      }
    });
    return verified;
  }
}
