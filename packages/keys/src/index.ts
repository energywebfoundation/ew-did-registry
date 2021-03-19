import { ec as EC } from 'elliptic';
import BN from 'bn.js';
import { encrypt, decrypt } from 'eciesjs';
import { Wallet } from 'ethers';
import { IKeys } from './interface';
import { KeyPair } from './models';
import { sha256 } from './functions';

const ec = new EC('secp256k1');

class Keys implements IKeys {
  private readonly _keyPair: EC.KeyPair;

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
  constructor({ privateKey, publicKey }: KeyPair = {}) {
    if (privateKey) {
      this._keyPair = ec.keyFromPrivate(privateKey, 'hex');
      this.privateKey = privateKey;
    } else if (publicKey) {
      this._keyPair = ec.keyFromPublic(publicKey, 'hex');
      this.privateKey = '';
    } else {
      this._keyPair = ec.genKeyPair();
      this.privateKey = this._keyPair.getPrivate('hex').padStart(64, '0');
    }
    this.publicKey = this._keyPair.getPublic(true, 'hex').padStart(66, '0');
  }

  getAddress(): string {
    return new Wallet(this.privateKey).address.toString();
  }

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
  async decrypt(encrypted: string, publicKey?: string): Promise<string> {
    const encryptedBuffer = Buffer.from(encrypted, 'hex');
    const privateKeyBuffer = Buffer.from(this.privateKey, 'hex');
    const data = await decrypt(privateKeyBuffer, encryptedBuffer);
    return data.toString();
  }

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
  async encrypt(data: string, publicKeyTo?: string): Promise<string> {
    const publicKeyToBuffer = Buffer.from(publicKeyTo || this.publicKey, 'hex');
    const dataBuffer = Buffer.from(data);
    const encrypted = await encrypt(
      publicKeyToBuffer,
      dataBuffer,
    );
    return encrypted.toString('hex');
  }

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
  sign(data: string, privateKey?: string): string {
    let keyPair = this._keyPair;
    if (privateKey) {
      keyPair = ec.keyFromPrivate(privateKey, 'hex');
    }

    const hash = sha256(data);

    const signature = keyPair.sign(hash, 'hex', {
      canonical: true,
      pers: true,
    });
    return signature.r.toString(16, 64) + signature.s.toString(16, 64);
  }

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
  verify(data: string, signature: string, publicKey?: string): boolean {
    let keyPair = this._keyPair;
    if (publicKey) {
      keyPair = ec.keyFromPublic(publicKey, 'hex');
    }

    const r = new BN(signature.slice(0, 64), 16).toString('hex');
    const s = new BN(signature.slice(64, 128), 16).toString('hex');

    const hash = sha256(data);
    return keyPair.verify(hash, { r, s });
  }

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
  static generateKeyPair(): KeyPair {
    const keyPair = ec.genKeyPair();
    return {
      privateKey: keyPair.getPrivate('hex').padStart(64, '0'),
      publicKey: keyPair.getPublic(true, 'hex').padStart(66, '0'),
    };
  }
}

export {
  Keys,
  IKeys,
};
