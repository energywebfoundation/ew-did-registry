export enum ProviderTypes {
    HTTP,
    IPC,
    Websocket,
}

/**
 * Specifies current Provider
 */
export interface IProvider {
    uri: string;
    type: ProviderTypes;
    options?: object;
}

/**
 * Resolver requires provider, as well as application binary interface and
 * address of the smart contract representing DID Registry
 */
export interface IResolverSettings {
    provider?: IProvider;
    abi?: string;
    address?: string;
}

export interface IDIDDocument {
    context: string;
    id: string;
    publicKey: IPublicKey[];
    authentication: Array<IAuthentication | string>;
    delegates: string[];
    service: IServiceEndpoint[];
    created: string;
    updated: string;
    proof?: ILinkedDataProof;
}

export interface IServiceEndpoint {
    id: string;
    type: string;
    serviceEndpoint: string;
    description?: string;
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
}

export interface IAuthentication {
    type: string;
    publicKey: string;
}

export interface ILinkedDataProof {
    type: string;
    created: string;
    creator: string;
    signatureValue: string;
}
