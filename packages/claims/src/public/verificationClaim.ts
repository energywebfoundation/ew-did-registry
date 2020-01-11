import Claim from './claim';
import { IVerificationClaim } from '../models';

class VerificationClaim extends Claim implements IVerificationClaim {
  /**
   * Verify method checks if the token was signed by the correct private key
   * Returns true on success
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
   * const verified = await verificationClaim.verify();
   * console.log(verified) // Should be true, if successful
   * ```
   *
   * @returns {Promise<boolean>}
   */
  async verify(): Promise<boolean> {
    await this.getDid();
    const publicKey = this.didDocument.publicKey.find((pk) => pk.type === 'Secp256k1VerificationKey');
    try {
      await this.jwt.verify(this.token, publicKey.ethereumAddress.slice(2));
    } catch (error) {
      throw (new Error(error));
    }
    return true;
  }

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
  async approve(): Promise<string> {
    const decodedPayload = this.jwt.decode(this.token);
    let signedToken;
    try {
      signedToken = await this.jwt.sign(decodedPayload, { algorithm: 'ES256', noTimestamp: true });
    } catch (error) {
      throw (new Error(error));
    }

    return signedToken;
  }
}

export default VerificationClaim;
