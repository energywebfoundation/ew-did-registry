/* eslint-disable no-shadow */
import { utils, BigNumber, providers, ContractInterface } from 'ethers';
import { Methods } from '@ew-did-registry/did';

/**
 * Specifies currently supported provider types. New types can be added in the future.
 */
export enum ProviderTypes {
  HTTP,
  IPC,
}

/**
 * Specifies Provider to be used to communicate with blockchain.
 * The uri, path, and method are the parameters found in the ethers library.
 * Hence, 'ethers' documentation is a good point to check the available options,
 * if one wants to extend the library.
 */
export interface ProviderSettings {
  type: ProviderTypes;
  uriOrInfo?: string | utils.ConnectionInfo;
  path?: string;
  network?: providers.Networkish;
}

/**
 * Resolver requires provider, as well as application binary interface and
 * address of the smart contract representing DID Registry
 */
export interface RegistrySettings {
  address: string;
  abi?: ContractInterface;
  method?: Methods;
}

export interface IServiceEndpoint {
  id: string;
  type: string;
  serviceEndpoint: string;
  description?: string;
  validity: BigNumber;
  block: number;
  hash?: string; // hash of the content located at service endpoint
  [key: string]: string | BigNumber | number | undefined | { nodes: string[] };
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
  validity: BigNumber;
  block: number;
  [key: string]: string | number | BigNumber | undefined;
}

export interface IAuthentication {
  type: string;
  publicKey: string;
  validity: BigNumber;
  block?: number;
  [key: string]: string | BigNumber | number | undefined;
}

export interface ILinkedDataProof {
  type: string;
  created: string;
  creator: string;
  signatureValue: string;
}

export enum DidEventNames {
  AttributeChanged = 'DIDAttributeChanged',
  DelegateChanged = 'DIDDelegateChanged',
}

/**
 * This interface represents the structure of event emitted by ERC1056 compliant smart contract.
 */
export interface ISmartContractEvent {
  name: DidEventNames;
  signature: string;
  topic: string;
  value?: string;
}

export interface AttributeChangedEvent extends ISmartContractEvent {
  name: DidEventNames.AttributeChanged;
  values: {
    identity: string;
    name: string;
    value: string;
    validTo: BigNumber;
    previousChange: BigNumber;
  };
}

export interface DelegateChangedEvent extends ISmartContractEvent {
  name: DidEventNames.DelegateChanged;
  values: {
    identity: string;
    delegateType: string;
    delegate: string;
    validTo: BigNumber;
    previousChange: BigNumber;
  };
}

/**
 * This interface is used to store the parse data from events.
 * The log data will be used for caching and further analysed to construct the did document,
 * as new data arrives.
 * The data in the did document will exclude certain variables, such as
 * 'lastChangedBlock', 'created', 'updated', 'proof'
 */
export interface IDIDLogData {
  owner: string;
  topBlock: BigNumber;
  publicKey: { [key: string]: IPublicKey };
  authentication: { [key: string]: IAuthentication };
  delegates?: string[];
  service: { [key: string]: IServiceEndpoint };
  created?: string;
  updated?: string;
  proof?: ILinkedDataProof;
  attributes: Map<string, { [key: string]: string | number | unknown }>;
}

/**
 * Our assumption that delegates can be of two types, according to the standard. However,
 * Other types can be added in the future, if required.
 */
export enum DelegateTypes {
  authentication = 'sigAuth',
  verification = 'veriKey',
}

export type DocumentSelector = Partial<{
  publicKey: Partial<IPublicKey>;
  service: Partial<IServiceEndpoint>;
  authentication: Partial<IAuthentication>;
}>;

/**
 * The interface of DID Document is compliant with W3C specification.
 * https://w3c.github.io/did-core/
 * The link above will be the best point of reference for the interface below, including
 * IServiceEndpoint, IPublicKey, IAuthentication, ILinkedDataProof
 */
export interface IDIDDocument {
  '@context': string;
  id: string;
  publicKey: IPublicKey[];
  authentication: Array<IAuthentication | string>;
  delegates?: string[];
  service: IServiceEndpoint[];
  created?: string;
  updated?: string;
  proof?: ILinkedDataProof;
}
