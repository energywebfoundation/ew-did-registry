import { IResolverSettings, ProviderTypes } from '../models';
export declare const address1056 = "0x8CdaF0CD259887258Bc13a92C0a6dA92698644C0";
export declare const abi1056: ({
    constant: boolean;
    inputs: {
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        name: string;
        type: string;
    }[];
    payable: boolean;
    stateMutability: string;
    type: string;
    anonymous?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    constant?: undefined;
    outputs?: undefined;
    payable?: undefined;
    stateMutability?: undefined;
})[];
export declare const defaultProvider: {
    uriOrInfo: string;
    type: ProviderTypes;
};
/**
 * The three above comprise the minimal settings for resolver.
 * One can adjust them to use the resolver with a different provider
 * or with a different smart contract.
 */
export declare const defaultResolverSettings: IResolverSettings;
export declare const matchingPatternDidEvents: RegExp;
export declare const matchingPatternDid: RegExp;
export declare const ethAddrPattern = "0x[A-Fa-f0-9]{40}";
export declare const delegatePubKeyIdPattern: string;
export declare const pubKeyIdPattern: string;
export declare const serviceIdPattern: string;
