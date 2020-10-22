import { IServiceEndpoint } from "./resolver";

/**
 * Currently, there are three types of DID Attributes, this can be potentially extended
 */
export enum DIDAttribute {
  PublicKey = 'pub', Authenticate = 'auth', ServicePoint = 'svc'
}

/**
 * The two main types of public keys are, in turn, verification key and signature authentication key
 */
export enum PubKeyType {
  SignatureAuthentication2018 = 'sigAuth', VerificationKey2018 = 'veriKey'
}

/**
 * Encoding specifies the format in which the public key is store
 */
export enum Encoding {
  HEX = 'hex', BASE64 = 'base64', PEM = 'pem'
}

/**
 * Algorithms specifies, which algorithm has to be used with a particular public key
 */
export enum Algorithms {
  ED25519 = 'Ed25519', RSA = 'Rsa', ECDSA = 'ECDSA', Secp256k1 = 'Secp256k1'
}

/**
 * KeyTags specifies the tags associated with different purposes of the keys
 */
export enum KeyTags {
  OWNER = 'key-owner'
}

/** This interface represents the attribute payload
 * TODO : avoid use of IAttributePayload, reuse IPublicKey and IServiceEndpoint
*/
export interface IAttributePayload {
  id?: string;
  type?: string,
  publicKey?: string;
  serviceEndpoint?: string;
  tag?: string;
  hash?: string;
  hashAlg?: string;
}

/**
 * Data used to update DID Document. To update the public key you need to set its value in value
 * field, and to set authentication method, the delegate's Ethereum address must be set in the
 * delegate field
 */
export interface IUpdateData {
  encoding?: Encoding;
  algo?: Algorithms;
  type: PubKeyType | DIDAttribute;
  value?: IAttributePayload ;
  delegate?: string;
}
