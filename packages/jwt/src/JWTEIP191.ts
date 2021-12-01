/* eslint-disable no-restricted-syntax */
import { Signer, utils, Wallet } from 'ethers';
import base64url from 'base64url';
import { IKeys } from '@ew-did-registry/keys';
import { IJWT } from './interface';
import { JwtSignOptions, JwtPayload } from './types';
import { JwtBase } from './JwtBase';

const { arrayify, keccak256 } = utils;

export class JWT extends JwtBase implements IJWT {
  private _signer: Signer;

  constructor(signer: IKeys | Signer) {
    super();
    if ((signer as IKeys).privateKey) {
      this._signer = new Wallet((signer as IKeys).privateKey);
    } else if (Signer.isSigner(signer)) {
      this._signer = signer;
    } else {
      throw new Error('Unsupported EIP191 signer');
    }
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
  async sign(
    payload: string | JwtPayload,
    { issuer, subject, noTimestamp }: JwtSignOptions = {},
  ): Promise<string> {
    const header = {
      alg: 'ES256K',
      typ: 'JWT',
    };
    const encodedHeader = base64url(JSON.stringify(header));
    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    }
    payload = payload as JwtPayload;
    if (issuer) {
      payload.iss = issuer;
    }
    if (subject) {
      payload.sub = subject;
    }
    if (!noTimestamp) {
      payload.iat = new Date().getTime();
    }
    const encodedPayload = base64url(JSON.stringify(payload));
    const msg = `0x${Buffer.from(`${encodedHeader}.${encodedPayload}`).toString(
      'hex',
    )}`;
    const signature = await this._signer.signMessage(arrayify(keccak256(msg)));
    const encodedSignature = base64url(signature);
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }
}

export { IJWT };
