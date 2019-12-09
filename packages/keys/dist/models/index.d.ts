export interface KeyPair {
    privateKey?: string;
    publicKey?: string;
}
export declare const ECDSA_PATTERNS: {
    secp256k1: {
        PRIVATE_KEY: RegExp;
        PUBLIC_KEY: RegExp;
        SIGNATURE: RegExp;
    };
};
