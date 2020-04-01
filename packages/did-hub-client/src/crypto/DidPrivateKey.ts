/* eslint-disable @typescript-eslint/camelcase */
import { EcPrivateKey, PublicKey, PrivateKey } from '@decentralized-identity/did-auth-jose';
import EcPublicKey from '@decentralized-identity/did-auth-jose/dist/lib/crypto/ec/EcPublicKey';
import { IDidDocumentPublicKey } from '@decentralized-identity/did-common-typescript';
import { KeyOperation } from '@decentralized-identity/did-auth-jose/dist/lib/security/PublicKey';
import ecKey from 'ec-key';
import { DidPublicKey } from './DidPublicKey';


/**
 * Represents an Elliptic Curve private key
 * @class
 * @extends PrivateKey
 */
export class DidPrivateKey extends DidPublicKey implements PrivateKey {
  /** ECDSA w/ secp256k1 Curve */
  readonly defaultSignAlgorithm: string = 'ES256K';

  /** Private exponent */
  public d: string;

  /**
   * Constructs a private key given a DID Document public key descriptor containing additional private key
   * information.
   *
   * TODO: This feels odd, should define a separate type.
   *
   * @param key public key object with additional private key information
   */
  constructor(key: IDidDocumentPublicKey) {
    super(key);
    const data = (key as any).publicKeyJwk;
    if (!('d' in data)) {
      throw new Error('d required for private elliptic curve key.');
    }
    this.d = data.d;
  }

  /**
   * Wraps a EC private key in jwk format into a Did Document public key object with additonal information
   * @param kid Key ID
   * @param jwk JWK of the private key
   */
  static wrapJwk(kid: string, jwk: any): DidPrivateKey {
    return new DidPrivateKey({
      id: kid,
      type: 'EdDsaSAPublicKeySecp256k1',
      publicKeyJwk: jwk,
    } as IDidDocumentPublicKey);
  }

  /**
   * Generates a new private key
   * @param kid Key ID
   */
  static async generatePrivateKey(kid: string): Promise<DidPrivateKey> {
    const key = ecKey.createECKey('P-256K');

    // Add the additional JWK parameters
    const jwk = Object.assign(key.toJSON(), {
      kid,
      alg: 'ES256K',
      key_ops: [KeyOperation.Sign, KeyOperation.Verify],
    });

    return DidPrivateKey.wrapJwk(kid, jwk);
  }

  getPublicKey(): PublicKey {
    return {
      kty: this.kty,
      kid: this.kid,
      crv: this.crv,
      x: this.x,
      y: this.y,
      use: 'verify',
      defaultEncryptionAlgorithm: 'ECIES',
    } as DidPublicKey;
  }
}
