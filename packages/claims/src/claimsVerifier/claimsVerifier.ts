// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import {
  bn, hash, ecc, bitArray,
} from 'sjcl';
import { DelegateTypes } from '@ew-did-registry/did-resolver-interface';
import crypto from 'crypto';
import { Claims } from '../claims';
import { IClaimsVerifier } from '../interface';
import { IProofClaim, IPublicClaim } from '../models';

export class ClaimsVerifier extends Claims implements IClaimsVerifier {
  /**
   * Verifies integrity of the claim, the claim is issued by the user
   *  delegate and the authenticity of the issuer's signature
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
   * @returns { Promise<void> } whether the proof was succesfull
   * @throws if the proof failed
   */
  async verifyPublicProof(claimUrl: string): Promise<IPublicClaim> {
    return this.verify(claimUrl) as Promise<IPublicClaim>;
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
  * const verified = claims.verifyPrivateProof(proofToken);
  * ```
  * @param { string } proofToken contains proof data
  * @param { string } privateToken contains private data
  * @returns { Promise<void> } whether the proof was succesfull
  * @throws if the proof failed
  */
  async verifyPrivateProof(proofToken: string): Promise<void> {
    const { claimUrl } = this.jwt.decode(proofToken) as { claimUrl: string };
    const privateClaim = await this.verify(claimUrl);
    const curve: sjcl.SjclEllipticalCurve = ecc.curves.k256;
    const g = curve.G;
    const proofClaim: IProofClaim = this.jwt.decode(proofToken) as IProofClaim;
    if (!(await this.verifySignature(proofToken, proofClaim.signer))) {
      throw new Error('Invalid signature');
    }
    if (
      !this.document
        .isValidDelegate(
          DelegateTypes.verification,
          privateClaim.signer,
          privateClaim.did,
        )
    ) {
      throw new Error('Issuer isn\'t a use\'r delegate');
    }

    const { proofData } = proofClaim;
    // eslint-disable-next-line no-restricted-syntax
    Object.entries(privateClaim.claimData).forEach(([key, value]) => {
      const field = proofData[key];
      if (field.encrypted) {
        const PK = curve.fromBits(value as []);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        let { h, s } = field.value;
        h = curve.fromBits(h);
        s = bn.fromBits(s);
        const c = bn.fromBits(
          hash.sha256.hash(
            g.x.toBits()
              .concat(h.toBits())
              .concat(PK.toBits()),
          ),
        );
        const left = g.mult(s);
        const right = PK.mult(c).toJac().add(h).toAffine();
        if (!bitArray.equal(left.toBits(), right.toBits())) {
          throw new Error('User didn\'t prove the knowledge of the private data');
        }
      } else {
        const fieldHash = crypto.createHash('sha256').update(field.value as string).digest('hex');
        // eslint-disable-next-line new-cap
        const PK = g.mult(new bn(fieldHash));
        const bitsPK = PK.toBits();

        if (!bitArray.equal(value as [], bitsPK)) {
          throw new Error('Disclosed field does not correspond to stored field');
        }
      }
    });
  }
}
