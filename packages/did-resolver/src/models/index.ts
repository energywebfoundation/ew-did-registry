import {
  ParamType,
  BigNumber,
  ConnectionInfo,
  Networkish,
} from 'ethers/utils';

export { default as Operator } from './operator';

export enum ProviderTypes {
    HTTP,
    IPC,
}

/**
 * Specifies current Provider
 */
export interface IProvider {
    type: ProviderTypes;
    uriOrInfo?: string | ConnectionInfo;
    path?: string;
    network?: Networkish;
}

/**
 * Resolver requires provider, as well as application binary interface and
 * address of the smart contract representing DID Registry
 */
export interface IResolverSettings {
    provider?: IProvider;
    abi?: Array<string | ParamType>;
    address?: string;
}

export interface IDIDDocument {
    '@context': string;
    id: string;
    publicKey: IPublicKey[];
    authentication: Array<IAuthentication | string>;
    delegates?: string[];
    service?: IServiceEndpoint[];
    created?: string;
    updated?: string;
    proof?: ILinkedDataProof;
}

export interface IServiceEndpoint {
    id: string;
    type: string;
    serviceEndpoint: string;
    description?: string;
    validity?: BigNumber;
}

export interface IPublicKey {
    id: string;
    type: string;
    controller: string;
    ethereumAddress?: string;
    publicKeyBase64?: string;
    publicKeyBase58?: string;
    publicKeyHex?: string;
    publicKeyPem?: string;
    publicKeyJwk?: string;
    publicKeyMultibase?: string;
    validity?: BigNumber;
}

export interface IAuthentication {
    type: string;
    publicKey: string;
    validity?: BigNumber;
}

export interface ILinkedDataProof {
    type: string;
    created: string;
    creator: string;
    signatureValue: string;
}

export interface ISmartContractEvent {
    name: string;
    signature: string;
    topic: string;
    values: {
        identity: string;
        delegateType: string;
        delegate: string;
        validTo: BigNumber;
        previousChange: object;
        name?: string;
        value?: string;
    };
    value?: string;
}

export interface IDIDLogData {
    owner: string;
    publicKey: { [key: string]: IPublicKey };
    authentication: { [key: string]: string };
    delegates?: string[];
    serviceEndpoints?: { [key: string]: IServiceEndpoint };
    created?: string;
    updated?: string;
    proof?: ILinkedDataProof;
    attributes?: Map<string, { [key: string]: string | object}>;
}

export interface IHandlers {
    [key: string]: (event: ISmartContractEvent,
                    etherAddress: string,
                    document: IDIDLogData,
                    validTo: BigNumber) => IDIDLogData;
}

export enum DIDAttribute {
  PublicKey = 'pub', Authenticate = 'auth', ServicePoint = 'svc'
}

export enum PubKeyType {
  SignatureAuthentication2018 = 'sigAuth', VerificationKey2018 = 'veriKey'
}

export enum Encoding {
  HEX = 'hex', BASE64 = 'base64', PEM = 'pem', BASE58 = 'base58'
}

/**
 * Data used to update DID Document. To update the public key you need to set its value in value
 * field, and to set authentication method, the delegate ethereum address must be set in the
 * delegate field
 */
export interface IUpdateData {
  encoding: Encoding;
  algo: string;
  type: PubKeyType;
  value?: string;
  delegate?: string;
}

export enum Algorithms {
  ED25519 = 'Ed25519'
}
