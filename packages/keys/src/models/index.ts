export interface KeyPair {
    privateKey?: string;
    publicKey?: string;
}

export const ECDSA_PATTERNS = {
  secp256k1: {
    PRIVATE_KEY: /^[a-f0-9]{64}$/,
    PUBLIC_KEY: /^[a-f0-9]{66}$/,
    SIGNATURE: /^[a-f0-9]{128}$/,
  },
};
