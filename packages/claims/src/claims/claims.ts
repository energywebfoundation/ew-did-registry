import { Wallet } from 'ethers';
import { IDIDDocument, IResolver } from '@ew-did-registry/did-resolver-interface';
import { DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { IClaims } from '../models';

/**
 * @class
 * Base class for extending by other claims classes
 */
export class Claims implements IClaims {
  /**
   * Used for creation of new Resolvers
   */
  protected readonly resolver: IResolver;

  /**
   * jwt stores the JWT to manage web tokens
   */
  public jwt: IJWT;

  /**
   * Key pair represents the implementation of key management interface
   */
  public keys: IKeys;

  public did: string;

  /**
   * @constructor
   *
   * @param { IKeys } keys user key pair
   * @param { IResolver } resolver
   */
  constructor(keys: IKeys, resolver: IResolver) {
    this.resolver = resolver;
    this.keys = keys;
    this.jwt = new JWT(keys);
    const { address } = new Wallet(keys.privateKey);
    this.did = `did:${resolver.settings.method}:${address}`;
  }

  /**
   * Fetches DID document of the corresponding DID
   *
   * @example
   * ```typescript
   * import { Keys } from '@ew-did-registry/keys';
   * import { Claims } from '@ew-did-registry/claims';
   *
   * const user = new Keys();
   * const claims = new Claims(user);
   * const did = `did:${Methods.Erc1056}:user_id`;
   * const document = await claims.getDocument(did);
   * ```
   *
   * @returns {Promise<IDIDDocument>}
   */
  async getDocument(did: string): Promise<IDIDDocument> {
    const factory = new DIDDocumentFactory(did);
    const docLite = factory.createLite(this.resolver);
    return docLite.read(did);
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
    const signerDocument = await this.getDocument(signer);
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
