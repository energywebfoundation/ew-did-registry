/* eslint-disable no-shadow */
import { KeyType } from '@ew-did-registry/keys';

/**
 * Currently, there are three types of DID Attributes, this can be potentially extended
 */
export enum DIDAttribute {
  PublicKey = 'pub',
  Authenticate = 'auth',
  ServicePoint = 'svc',
}

/**
 * The two main types of public keys are, in turn, verification key and signature authentication key
 */
export enum PubKeyType {
  SignatureAuthentication2018 = 'sigAuth',
  VerificationKey2018 = 'veriKey',
}

/**
 * Encoding specifies the format in which the public key is store
 */
export enum Encoding {
  HEX = 'hex',
  BASE64 = 'base64',
  PEM = 'pem',
}

/**
 * KeyTags specifies the tags associated with different purposes of the keys
 */
export enum KeyTags {
  OWNER = 'key-owner',
}

/** This interface represents the attribute payload
 * TODO : avoid use of IAttributePayload, reuse IPublicKey and IServiceEndpoint
 */
export interface IAttributePayload {
  id?: string;
  type?: string;
  publicKey?: string;
  serviceEndpoint?: string | { nodes: string[] };
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
  algo?: KeyType;
  type: PubKeyType | DIDAttribute;
  value?: IAttributePayload;
  delegate?: string;
}

export type IUpdateAttributeData = Omit<IUpdateData, 'delegate'> & {
  value: IAttributePayload;
};

export type IUpdateDelegateData = Omit<IUpdateData, 'value'> & {
  delegate: string;
};

export const PublicKeyEncoding = {
  detect: (publicKey: string): Encoding | undefined => {
    if (publicKey.match(/^0x[\da-f]+$/i)) return Encoding.HEX;
    if (publicKey.match(/^-+BEGIN CERTIFICATE-+.*?-+END CERTIFICATE-+$/))
      return Encoding.PEM;
    if (publicKey.match(/^[a-zA-Z0-9+/]+={0,2}$/i)) return Encoding.BASE64;
    return undefined;
  },
};
