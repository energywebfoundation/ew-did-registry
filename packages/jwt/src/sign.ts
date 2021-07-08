import { IKeys } from '@ew-did-registry/keys';
import KeyEncoder from 'key-encoder';
import * as jwt from 'jsonwebtoken';
import { Signer, utils } from 'ethers';
import base64url from 'base64url';

const keyEncoder = new KeyEncoder('secp256k1');

const { keccak256, arrayify } = utils;

export function createSignWithKeys() {
  return async (
    keys: IKeys,
    payload: string | JwtPayload,
    options?: JwtOptions,
  ): Promise<string> => new Promise(
    (resolve, reject) => {
      const pemPrivateKey = keyEncoder.encodePrivate(keys.privateKey, 'raw', 'pem');

      jwt.sign(payload, pemPrivateKey, options || {}, (error, token) => {
        if (error) reject(error);

        resolve(token);
      });
    },
  );
}

export type JwtOptions = {
  issuer?: string; subject?: string; noTimestamp?: boolean; algorithm?: jwt.Algorithm;
};
export type JwtPayload =
  { [key: string]: string | object } & { iss?: string; sub?: string; iat?: number };

export function createSignWithEthersSigner() {
  return async (
    signer: Signer,
    payload: string | JwtPayload,
    options?: JwtOptions,
  ): Promise<string> => {
    const header = {
      alg: 'ES256',
      typ: 'JWT',
    };
    const encodedHeader = base64url(JSON.stringify(header));
    if (typeof payload === 'string') {
      payload = JSON.parse(payload);
    }
    payload = payload as JwtPayload;
    if (!payload.issuer)
        payload.issuer = options?.issuer || '';
    if (!payload.subject)
        payload.subject = options?.subject || '';
    if (!options?.noTimestamp) {
      payload.iat = new Date().getTime();
    }

    const encodedPayload = base64url(JSON.stringify(payload));
    const msg = `0x${Buffer.from(`${encodedHeader}.${encodedPayload}`).toString('hex')}`;
    const signature = await signer.signMessage(arrayify(keccak256(msg)));
    const encodedSignature = base64url(signature);
    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  };
}
