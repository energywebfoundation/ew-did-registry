import { ProviderTypes } from '../models';
export declare const defaultResolverSettings: {
    provider: {
        uriOrInfo: string;
        type: ProviderTypes;
    };
    abi: ({
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
    address: string;
};
export declare const matchingPatternDidEvents: RegExp;
export declare const matchingPatternDid: RegExp;
