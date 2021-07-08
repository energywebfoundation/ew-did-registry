/**
 * Currently, there are three types of DID Attributes, this can be potentially extended
 */
export enum DIDAttribute {
  VerificationMethod = 'vm', Authenticate = 'auth', ServicePoint = 'svc'
}

/**
 * The two main types of public keys are, in turn, verification key and signature authentication key
 */
export enum VerificationMethodType {
  JsonWebKey2020 = 'jwk',
  Ed25519VerificationKey2018 = 'Ed25519VeriKey2018',
  EcdsaSecp256k1VerificationKey2019 = 'EcdsaSecp2k1VeriKey',
  SchnorrSecp256k1VerificationKey2019 = 'SchnoSecp2k1VeriKey',
  Bls12381G1Key2020 = 'Bls12381G1Key',
  Bls12381G2Key2020 = 'Bls12381G2Key',
  GpgVerificationKey2020 = 'GpgVeriKey2020',
  RsaVerificationKey2018 = 'RsaVeriKey2018',
  X25519KeyAgreementKey2019 = 'X25519KeyAgrKey',
  EcdsaSecp256k1RecoveryMethod2020 = 'EcdsaSecp2k1RecoMet'
}

export const VerificationMethodBackTypeMap: Map<string, string> = new Map([
  ['jwk', 'JsonWebKey2020'],
  ['Ed25519VeriKey2018', 'Ed25519VerificationKey2018'],
  ['EcdsaSecp2k1VeriKey', 'EcdsaSecp256k1VerificationKey2019'],
  ['SchnoSecp2k1VeriKey', 'SchnorrSecp256k1VerificationKey2019'],
  ['Bls12381G1Key', 'Bls12381G1Key2020'],
  ['Bls12381G2Key', 'Bls12381G2Key2020'],
  ['GpgVeriKey2020', 'GpgVerificationKey2020'],
  ['RsaVeriKey2018', 'RsaVerificationKey2018'],
  ['X25519KeyAgrKey', 'X25519KeyAgreementKey2019'],
  ['EcdsaSecp2k1RecoMet', 'EcdsaSecp256k1RecoveryMethod2020'],
]);


export enum ServiceEndpointType {
  ClaimRepo = 'ClaimRepo'
}

/**
 * Encoding specifies the format in which the public key is store
 */
export enum Encoding {
  HEX = 'hex', BASE64 = 'base64', PEM = 'pem', ETHADDR = 'addr'
}

/**
 * KeyTags specifies the tags associated with different purposes of the keys
 */
export enum KeyTags {
  OWNER = 'key-owner',
  STREAM = 'key-stream-authentication'
}

/** This interface represents the attribute payload
 * TODO : avoid use of IAttributePayload, reuse IVerificationMethod and IServiceEndpoint
*/
export interface IAttributePayload {
  id?: string;
  type?: string;
  verificationMethod?: string;
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
  type: VerificationMethodType | DIDAttribute | ServiceEndpointType;
  value?: IAttributePayload;
  delegate?: string;
}

export type IUpdateAttributeData = Omit<IUpdateData, 'delegate'> & { value: IAttributePayload };

export type IUpdateDelegateData = Omit<IUpdateData, 'value'> & { delegate: string };
