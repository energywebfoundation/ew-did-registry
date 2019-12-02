import { IKeys } from './interface';
import { KeyPair } from './models';
declare class Keys implements IKeys {
    private readonly _keyPair;
    /**
     * Private Key of secp256k1
     */
    privateKey: string;
    /**
     * Public Key of secp256k1
     */
    publicKey: string;
    /**
     * @param {string} privateKey
     * @param {string} publicKey
     */
    constructor({ privateKey, publicKey }?: KeyPair);
    /**
     * Decrypt the encrypted data that is given in hex format
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keysAlice = new Keys();
     * const keysBob = new Keys();
     * const data = 'test';
     * const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
     * const decrypted = await keysBob.decrypt(encrypted);
     * console.log(decrypted); // 'test'
     * ```
     *
     * @param {string} encrypted
     * @param {string} publicKey
     * @returns {Promise<string>}
     */
    decrypt(encrypted: string, publicKey?: string): Promise<string>;
    /**
     * Encrypt the data that is given in utf-8 string
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keysAlice = new Keys();
     * const keysBob = new Keys();
     * const data = 'test';
     * const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
     * console.log(encrypted); // hex symbols string
     * ```
     *
     * @param {string} data
     * @param {string} publicKeyTo
     * @returns {Promise<string>}
     */
    encrypt(data: string, publicKeyTo?: string): Promise<string>;
    /**
     * Sign the data
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keys = new Keys();
     * const data = 'test';
     * const signature = keys.sign(data);
     * console.log(signature); // 128 hex symbols string
     * ```
     *
     * @param {string} data
     * @param {string} privateKey
     * @returns {string}
     */
    sign(data: string, privateKey?: string): string;
    /**
     * Verify the signature
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keys = new Keys();
     * const data = 'test';
     * const signature = keys.sign(data);
     * console.log(keys.verify(signature)); // true
     * ```
     *
     * @param {string} data
     * @param {string} signature
     * @param {string} publicKey
     * @returns {boolean}
     */
    verify(data: string, signature: string, publicKey?: string): boolean;
    /**
     * Generates new key pair for secp256k1 algorithm.
     *
     * @example
     * ```typescript
     * import { Keys } from '@ew-did-registry/keys';
     *
     * const keyPair = Keys.generateKeyPair();
     * console.log(keyPair.privateKey) // 64 hex symbols string
     * console.log(keyPair.publicKey) // 66 hex symbols string
     * ```
     *
     * @returns {KeyPair}
     */
    static generateKeyPair(): KeyPair;
}
export { Keys, IKeys, };
