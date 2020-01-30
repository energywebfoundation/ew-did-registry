// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sjcl from 'sjcl-complete';
import { Resolver, DelegateTypes } from '@ew-did-registry/did-resolver';
import { decrypt } from 'eciesjs';
import crypto from 'crypto';
import { Claims } from '../claims';
import { IClaimsVerifier } from '../interface';
import { IClaim, IProofData } from '../models';

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
   * @returns { Promise<void> } whether the proof was succesfull
   * @throws if the proof failed
   */
  async verifyPublicProof(token: string): Promise<void> {
    const claim: IClaim = this.jwt.decode(token) as IClaim;
    if (!(await this.verifySignature(token, claim.signer))) {
      throw new Error('Invalid signatue');
    }
    const resolver = new Resolver();
    if (!resolver.validDelegate(claim.did, DelegateTypes.verification, claim.signer)) {
      throw new Error('Issuer isn\'t a use\'r delegate');
    }
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
  * @returns { Promise<void> } whether the proof was succesfull
  * @throws if the proof failed
  */
  async verifyPrivateProof(proofToken: string, privateToken: string): Promise<void> {
    const curve: sjcl.SjclEllipticalCurve = sjcl.ecc.curves.k256;
    const g = curve.G;
    const proofClaim: IClaim = this.jwt.decode(proofToken) as IClaim;
    if (!(await this.verifySignature(proofToken, proofClaim.signer))) {
      throw new Error('Invalid signature');
    }
    const resolver = new Resolver();

    const privateClaim: IClaim = this.jwt.decode(privateToken) as IClaim;
    if (!(await this.verifySignature(privateToken, privateClaim.signer))) {
      throw new Error('Invalid signature');
    }
    if (
      !resolver
        .validDelegate(
          privateClaim.did,
          DelegateTypes.verification,
          privateClaim.signer,
        )
    ) {
      throw new Error('Issuer isn\'t a use\'r delegate');
    }

    const proofClaimData = proofClaim.claimData as IProofData;
    // eslint-disable-next-line no-restricted-syntax
    Object.entries(privateClaim.claimData).forEach(([key, value]) => {
      const field = proofClaimData[key];
      if (field.encrypted) {
        const PK = curve.fromBits(value);
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        let { h, s } = field.value;
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
          throw new Error('User didn\'t prove the knowledge of the private data');
        }
      } else {
        const fieldHash = crypto.createHash('sha256').update(field.value).digest('hex');
        const PK = g.mult(new bn(fieldHash));
        const bitsPK = PK.toBits();
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < bitsPK.length; i++) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
          // @ts-ignore
          if (bitsPK[i] !== value[i]) {
            throw new Error('Disclosed field does not correspond to stored field');
          }
        }
      }
    });
  }
}
