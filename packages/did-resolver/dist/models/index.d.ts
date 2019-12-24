import { ParamType, BigNumber, ConnectionInfo, Networkish } from 'ethers/utils';
export declare enum ProviderTypes {
    HTTP = 0,
    IPC = 1
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
export interface IHandlers {
    [key: string]: (event: ISmartContractEvent, etherAddress: string, document: IDIDLogData, validTo: BigNumber, block: number) => IDIDLogData;
}
