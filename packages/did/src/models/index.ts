export interface IDidStore {
    [key: string]: string;
}

export enum Networks {
    Ethereum = 'eth',
    EnergyWeb = 'ewc'
}

export const DID_SCHEME_PATTERNS = {
  /**
     * DID specification rule for method-name
     * The pattern allows an empty identifier to identify a method or did-registry
     * See [Issue 34] {@link https://github.com/w3c/did-core/issues/34}
     */
  NETWORK_PATTERN: /^[a-z0-9]+$/,
  /**
     * DID specification rule for method-specific-id
     */
  ID_PATTERN: /^[\w.-]*(:[\w.-]*)*$/,
};
