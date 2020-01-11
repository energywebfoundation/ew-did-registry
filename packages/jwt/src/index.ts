import * as jwt from 'jsonwebtoken';
import KeyEncoder from 'key-encoder';

import { IKeys } from '@ew-did-registry/keys';
import { IJWT } from './interface';

const keyEncoder = new KeyEncoder('secp256k1');

class JWT implements IJWT {
  private readonly _keys: IKeys;

  /**
   * Key pair has to be passed on construction to JWT
   * @param {Keys} keys
   */
  constructor(keys: IKeys) {
    this._keys = keys;
  }

  /**
   * Sign payload and return JWT
   *
   * @example
   * ```typescript
   * import { Keys } from '@ew-did-registry/keys';
   * import { JWT } from '@ew-did-registry/jwt';
   *
   * const keyPair = new Keys();
   * const jwt = new JWT(keyPair);
   * const payload = {claim: 'test'};
   * let token;
   *
   * try {
   *   token = await jwt.sign(payload, { algorithm: 'ES256' });
   *   console.log(token);
   * } catch(e) {
   *   console.log(e);
   * }
   * ```
   *
   * @param {object} payload
   * @param {object} options
   * @returns {Promise<string>}
   */
  async sign(
    payload: string | { [key: string]: string | object},
    options?: object,
  ): Promise<string> {
    return new Promise(
      (resolve, reject) => {
        const pemPrivateKey = keyEncoder.encodePrivate(this._keys.privateKey, 'raw', 'pem');

        jwt.sign(payload, pemPrivateKey, options, (error: Error, token: string) => {
          if (error) reject(error);

          resolve(token);
        });
      },
    );
  }

  /**
   * If the signature is correct, method returns decoded JWT payload
   *
   * @example
   * ```typescript
   * import { Keys } from '@ew-did-registry/keys';
   * import { JWT } from '@ew-did-registry/jwt';
   *
   * const AliceKeyPair = new Keys();
   * const BobKeyPair = new Keys();
   * const jwtAlice = new JWT(AliceKeyPair);
   * const jwtBob = new JWT(BobKeyPair);
   * const payload = {claim: 'test'};
   *
   * const token = await jwtAlice.sign(payload, { algorithm: 'ES256' });
   *
   * let decoded;
   *
   * try {
   *   decoded = await jwtBob.verify(token, AliceKeyPair.publicKey);
   *   console.log(decoded);
   * } catch(e) {
   *   console.log(e);
   * }
   * ```
   *
   * @param {string} token
   * @param {string} publicKey
   * @param {object} options
   * @returns {Promise<object>}
   */
  async verify(token: string, publicKey: string, options?: object): Promise<object> {
    return new Promise(
      (resolve, reject) => {
        const pemPublicKey = keyEncoder.encodePublic(publicKey, 'raw', 'pem');
        jwt.verify(token, pemPublicKey, options, (error: Error, payload: object) => {
          if (error) reject(error);

          resolve(payload);
        });
      },
    );
  }

  /**
   * Return decoded JWT payload without verifying signature
   *
   * @example
   * ```typescript
   * import { Keys } from '@ew-did-registry/keys';
   * import { JWT } from '@ew-did-registry/jwt';
   *
   * const AliceKeyPair = new Keys();
   * const BobKeyPair = new Keys();
   * const jwtAlice = new JWT(AliceKeyPair);
   * const jwtBob = new JWT(BobKeyPair);
   * const payload = {claim: 'test'};
   *
   * const token = await jwtAlice.sign(payload, { algorithm: 'ES256' });
   *
   * const decoded = jwtBob.decode(token, {complete: true});
   * console.log(decoded.header);
   * console.log(decoded.payload.did);
   * ```
   *
   * @param {string} token
   * @param {object} options
   * @returns string | { [key: string]: any }
   */
  decode(token: string, options?: object): string | { [key: string]: string | object } {
    return jwt.decode(token, options);
  }
}

export {
  JWT,
  IJWT,
};
