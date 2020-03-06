import { IResolverSettings, ProviderTypes } from '../models';
export declare const address1056 = "0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af";
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
export declare const attributeNamePattern = "^did/(pub|auth|svc)/(\\w+)(/(\\w+))?(/(\\w+))?$";
export declare const DIDPattern: string;
export declare const delegatePubKeyIdPattern: string;
export declare const pubKeyIdPattern: string;
export declare const serviceIdPattern: string;
