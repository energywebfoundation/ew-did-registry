export interface IKeys {
    /**
     * Private key in hex format
     */
    privateKey: string;

    /**
     * Public key in hex format
     */
    publicKey: string;

    /**
     * Sign the data with private key
     * @param {string} data
     * @param {string} privateKey
     * @returns {string}
     */
    sign(data: string, privateKey?: string): string;

    /**
     * Verify the signature accordance to data with public key
     * @param {string} data
     * @param {string} signature
     * @param {string} publicKey
     * @returns {boolean}
     */
    verify(data: string, signature: string, publicKey?: string): boolean;

    /**
     * Encryption
     * @param {string} data
     * @param {string} publicKeyTo
     * @returns {string}
     */
    encrypt(data: string, publicKeyTo?: string): Promise<string>;

    /**
     * Decryption
     * @param {string} encrypted
     * @param {string} publicKeyTo
     * @returns {string}
     */
    decrypt(encrypted: string, publicKeyTo?: string): Promise<string>;
}
