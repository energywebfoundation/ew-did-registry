export const ECDSA_PATTERNS = {
  secp256k1: {
    PRIVATE_KEY: /^[a-f0-9]{64}$/,
    PUBLIC_KEY: /^[a-f0-9]{66}$/,
    SIGNATURE: /^[a-f0-9]{128}$/,
  },
};

/**
 * Key type specifies, which algorithm has to be used with a particular public key
 */
export enum KeyType {
  ED25519 = 'Ed25519', RSA = 'Rsa', Secp256k1 = 'Secp256k1', Secp256r1 = 'Secp256r1'
}
