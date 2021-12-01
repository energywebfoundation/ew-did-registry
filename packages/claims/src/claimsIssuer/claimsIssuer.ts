/* eslint-disable new-cap */
import { decrypt } from 'eciesjs';
import crypto from 'crypto';
import { bn, ecc } from 'sjcl';
import { Algorithms } from '@ew-did-registry/jwt';
import { IClaimsIssuer } from '../interface';
import { Claims } from '../claims';
import { IPrivateClaim, IPublicClaim } from '../models';
import { ProofVerifier } from '..';

export class ClaimsIssuer extends Claims implements IClaimsIssuer {
  /**
   * Verifies user signature on token and issue new token signed by issuer./
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
   * @param { string | IPublicClaim } claim - claim to issue. Can be
   * specified as signed or unsigned claim
   * @returns { Promise<string> } issued token
   */
  async issuePublicClaim(claim: string | IPublicClaim): Promise<string> {
    if (typeof claim === 'string') {
      claim = this.jwt.decode(claim) as IPublicClaim;
    }
    const { claimData, did } = claim;
    const signedToken = await this.jwt.sign(
      { claimData, did, signer: this.did },
      {
        algorithm: Algorithms.ES256, issuer: this.did, subject: claim.did, noTimestamp: true,
      },
    );
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
    if (!this.keys.privateKey) {
      throw new Error('Private claim not supported');
    }
    const curve: sjcl.SjclEllipticalCurve = ecc.curves.k256;
    const g = curve.G;
    const claim: IPrivateClaim = this.jwt.decode(token) as IPrivateClaim;
    const proofVerifier = new ProofVerifier(await this.document.read(claim.signer));
    if (!(await proofVerifier.verifyAssertionProof(token))) {
      throw new Error('User signature not valid');
    }
    claim.signer = this.did;
    Object.entries(claim.claimData).forEach(([key, value]) => {
      const decryptedField = decrypt(
        this.keys.privateKey as string,
        Buffer.from(value as string, 'hex'),
      );
      const fieldHash = crypto.createHash('sha256').update(decryptedField).digest('hex');
      const PK = g.mult(new bn(fieldHash));
      claim.claimData[key] = PK.toBits() as [];
    });
    delete claim.iss;
    return this.jwt.sign(
      claim,
      {
        algorithm: Algorithms.ES256,
        issuer: this.did,
        subject: claim.sub as string,
        noTimestamp: true,
      },
    );
  }
}

export default ClaimsIssuer;
