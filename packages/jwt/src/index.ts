/* eslint-disable no-restricted-syntax */
import * as jwt from 'jsonwebtoken';
import { Signer } from 'ethers';

import { IKeys } from '@ew-did-registry/keys';
import {
  createSignWithEthersSigner, createSignWithKeys, JwtOptions, JwtPayload,
} from './sign';
import { verificationMethods } from './verify';

class JWT {


  /**
   * Key pair has to be passed on construction to JWT
   * @param {Keys} keys
   */
  constructor() {
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
   * @param {object} payload
   * @param {object} options
   * @returns {Promise<string>}
   */
  static async sign(keys: IKeys | Signer, payload: string | JwtPayload, options?: JwtOptions,): Promise<string> {
    const _keys = keys as IKeys;
    const _signer = keys as Signer;
    if (_keys.privateKey && _keys.sign && _keys.verify) {
      return createSignWithKeys()(_keys, payload, options);
    } else {
      return createSignWithEthersSigner()(_signer, payload, options);
    }
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
  static async verify(
    token: string,
    publicKey: string,
    options?: Record<string, unknown>,
  ): Promise<object> {
    const verifications = [];
    for (const verifyMethod of verificationMethods) {
      verifications.push(verifyMethod(token, publicKey, options));
    }
    const results = await Promise.all(Array.from(verifications, (item) => item
      .then((value) => ({ ...value }))
      .catch((reason) => ({ success: false, payload: reason }))));
    for (const result of results) {
      if (result.success) {
        return result.payload;
      }
    }
    throw new Error('invalid signature');
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
  static decode(token: string, options?: object): string | {
    [key: string]: string | object;
  } {
    return jwt.decode(token, options) || '';
  }
}

export {
  JWT,
};
