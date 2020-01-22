import { Wallet } from 'ethers';
import { IResolver, IDIDDocument } from '@ew-did-registry/did-resolver';
import { DIDDocumentFactory } from '@ew-did-registry/did-document';
import { IJWT, JWT } from '@ew-did-registry/jwt';
import { IKeys } from '@ew-did-registry/keys';
import { Networks } from '@ew-did-registry/did';
import { IClaims } from '../models';

/**
 * @class
 * Base class for extending by other claims classes
 */
export class Claims implements IClaims {
  /**
   * Used for creation of new Resolvers
   */
  private readonly resolver: IResolver;

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
    this.did = `did:${Networks.Ethereum}:${address}`;
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
   * const did = `did:${Networks.Ethereum}:user_id`;
   * const document = await claims.getDocument(did);
   * ```
   *
   * @returns {Promise<IDIDDocument>}
   */
  async getDocument(did: string): Promise<IDIDDocument> {
    const documentFactory = new DIDDocumentFactory(did);
    const didDocumentLite = documentFactory.createLite(this.resolver);
    await didDocumentLite.read(did);
    return didDocumentLite.didDocument;
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
      await this.jwt.verify(token, issuerPublicKey);
    } catch (error) {
      return false;
    }
    return true;
  }
}
