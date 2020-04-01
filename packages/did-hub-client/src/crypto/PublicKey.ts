import { Url } from 'url';

/**
 * JWA recommended KeyTypes to be implemented
 */
export enum RecommendedKeyType {
  None = '',
  Ec = 'EC',
  Rsa = 'RSA',
  Oct = 'oct'
}

/**
 * JWK key operations
 */
export enum KeyOperation {
  Sign = 'sign',
  Verify = 'verify',
  Encrypt = 'encrypt',
  Decrypt = 'decrypt',
  WrapKey = 'wrapKey',
  UnwrapKey = 'unwrapKey',
  DeriveKey = 'deriveKey',
  DeriveBits = 'deriveBits'
}

/**
 * Represents a Public Key in JWK format.
 * @class
 * @abstract
 * @hideconstructor
 */
export abstract class PublicKey {
  /** Key type */
  kty: string = RecommendedKeyType.None;

  /** Key ID */
  kid = '';

  /** Intended use */
  use?: string; // "sig" "enc"

  /** Valid key operations (key_ops) */
  key_ops?: KeyOperation[];

  /** Algorithm intended for use with this key */
  alg?: string;

  /** A resource for a X.509 public key certificate */
  x5u?: Url;

  /** One or more PKIX certificates as base64 DER */
  x5c?: string[];

  /** Base64URL SHA-1 thumbprint of the DER of an X.509 certificate */
  x5t?: string;

  /** base64URL SHA-256 thumbprint of the DER of the X.509 certificate */
  x5tS256?: string;

  /** Default Encryption Algorithm for JWE 'alg' field */
  readonly defaultEncryptionAlgorithm: string = 'ECIES';
}
