import { ParamType, BigNumber, ConnectionInfo, Networkish } from 'ethers/utils';
/**
 * Specifies currently supported provider types. New types can be added in the future.
 */
export declare enum ProviderTypes {
    HTTP = 0,
    IPC = 1
}
/**
 * Specifies Provider to be used to communicate with blockchain.
 * The uri, path, and network are the parameters found in the ethers library.
 * Hence, 'ethers' documentation is a good point to check the available options,
 * if one wants to extend the library.
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
    block?: number;
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
    block?: number;
    [key: string]: string | number | BigNumber;
}
export interface IAuthentication {
    type: string;
    publicKey: string;
    validity?: BigNumber;
    block?: number;
}
export interface ILinkedDataProof {
    type: string;
    created: string;
    creator: string;
    signatureValue: string;
}
/**
 * This interface represents the structure of event emitted by ERC1056 compliant smart contract.
 */
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
/**
 * This interface is used to store the parse data from events.
 * The log data will be used for caching and further analysed to construct the did document,
 * as new data arrives.
 * The data in the did document will exclude certain variables, such as
 * 'lastChangedBlock', 'created', 'updated', 'proof'
 */
export interface IDIDLogData {
    owner: string;
    lastChangedBlock: BigNumber;
    publicKey: {
        [key: string]: IPublicKey;
    };
    authentication: {
        [key: string]: IAuthentication;
    };
    delegates?: string[];
    serviceEndpoints?: {
        [key: string]: IServiceEndpoint;
    };
    created?: string;
    updated?: string;
    proof?: ILinkedDataProof;
    attributes?: Map<string, {
        [key: string]: string | number | object;
    }>;
}
/**
 * This interface simply specifies the handler functions for different event types
 * in order to parse the data from the events in the blockchain.
 */
export interface IHandlers {
    [key: string]: (event: ISmartContractEvent, etherAddress: string, document: IDIDLogData, validTo: BigNumber, block: number) => IDIDLogData;
}
/**
 * Our assumption that delegates can be of two types, according to the standard. However,
 * Other types can be added in the future, if required.
 */
export declare enum DelegateTypes {
    authentication = "sigAuth",
    verification = "veriKey"
}
