export enum DIDAttribute {
  PublicKey = 'pub', Authenticate = 'auth', ServicePoint = 'svc'
}

export enum PubKeyType {
  SignatureAuthentication2018 = 'sigAuth', VerificationKey2018 = 'veriKey'
}

export enum Encoding {
  HEX = 'hex', BASE64 = 'base64', PEM = 'pem', BASE58 = 'base58'
}

export enum Algorithms {
  ED25519 = 'Ed25519', RSA = 'rsa', ECDSA = 'ecdsa'
}

/**
 * Data used to update DID Document. To update the public key you need to set its value in value
 * field, and to set authentication method, the delegate ethereum address must be set in the
 * delegate field
 */
export interface IUpdateData {
  encoding: Encoding;
  algo: Algorithms;
  type: PubKeyType;
  value?: string;
  delegate?: string;
}
