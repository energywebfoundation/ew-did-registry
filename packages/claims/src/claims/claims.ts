import { IDIDDocumentFull } from '@ew-did-registry/did-document';
import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IDidStore } from '@ew-did-registry/did-store-interface';
import { IClaims } from '../models';

/**
 * @class
 * Base class for extending by other claims classes
 */
export class Claims implements IClaims {
  public jwt: IJWT;

  public keys: IKeys;

  public did: string;

  /**
   * @constructor
   *
   * @param { IKeys } keys
   * @param { IResolver } resolver
   */
  constructor(keys: IKeys, protected document: IDIDDocumentFull, protected store: IDidStore) {
    this.keys = keys;
    this.jwt = new JWT(keys);
    this.did = document.did;
  }

  /**
   * Verifies signers signature on received token
   * @example
   * ```typescript
   * import { Keys } from '@ew-did-registry/keys';
   * import { Claims } from '@ew-did-registry/claims';
   *
   * const user = new Keys();
   * const claims = new Claims(user);
   * const verified = claims.verifySignature(token, userDid);
   * ```
   *
   * @param { string } token token signature on which you want to check
   * @param { string } signer did of the signer
   */
  async verifySignature(token: string, signer: string): Promise<boolean> {
    const signerDocument = await this.document.read(signer);
    const issuerPublicKey = signerDocument
      .publicKey
      .find((pk: { type: string }) => pk.type === 'Secp256k1veriKey')
      .publicKeyHex;
    try {
      await this.jwt.verify(token, issuerPublicKey.slice(2));
    } catch (error) {
      return false;
    }
    return true;
  }
}
