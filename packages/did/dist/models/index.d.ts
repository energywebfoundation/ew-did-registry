export interface IDidStore {
    [key: string]: string;
}
export declare enum Networks {
    Ethereum = "eth",
    EnergyWeb = "ewc"
}
export declare const DID_SCHEME_PATTERNS: {
    NETWORK: RegExp;
    /**
       * DID specification rule for method-specific-id
     * DID specification rule for method-name
     * The pattern allows an empty identifier to identify a method or did-registry
     * See [Issue 34] {@link https://github.com/w3c/did-core/issues/34}
       */
    ID: RegExp;
};
