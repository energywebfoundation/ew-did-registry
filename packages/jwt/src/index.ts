/* eslint-disable no-restricted-syntax */
import * as jwt from 'jsonwebtoken';
import { Signer } from 'ethers';

import { IKeys } from '@ew-did-registry/keys';
import { PromiseRejection, PromiseResolution } from 'promise.allsettled';
import { IJWT } from './interface';
import {
  createSignWithEthersSigner, createSignWithKeys, JwtOptions, JwtPayload,
} from './sign';
import { verificationMethods } from './verify';

class JWT implements IJWT {
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
  public sign: (
    payload: string | JwtPayload,
    options?: JwtOptions) => Promise<string>;

  /**
   * Key pair has to be passed on construction to JWT
   * @param {Keys} keys
   */
  constructor(signerMethod: IKeys | Signer) {
    const keys = signerMethod as IKeys;
    const signer = signerMethod as Signer;
    if (keys.privateKey && keys.sign && keys.verify) {
      this.sign = createSignWithKeys(keys);
    } else {
      this.sign = createSignWithEthersSigner(signer);
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
  async verify(token: string, publicKey: string, options?: object): Promise<object> {
    const verifications = [];
    for (const verifyMethod of verificationMethods) {
      verifications.push(verifyMethod(token, publicKey, options));
    }
    const results = await Promise.all(Array.from(verifications, (item) => item
      .then((value) => ({ status: 'fulfilled', value } as PromiseResolution<object>))
      .catch((reason) => ({ status: 'rejected', reason } as PromiseRejection<typeof reason>))));
    for (const result of results) {
      if (result.status === 'fulfilled' && (result.value as any).success) {
        return (result.value as any).payload;
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
  decode(token: string, options?: object): string | {
    [key: string]: string | object;
  } {
    return jwt.decode(token, options);
  }
}

export {
  JWT,
  IJWT,
};
