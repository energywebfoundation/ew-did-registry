import { IKeys } from '@ew-did-registry/keys';
import KeyEncoder from 'key-encoder';
import * as jwt from 'jsonwebtoken';
import { Signer, utils } from 'ethers';
import base64url from 'base64url';

const keyEncoder = new KeyEncoder('secp256k1');

const { keccak256, arrayify } = utils;

export function createSignWithKeys(keys: IKeys) {
  const sign = async (
    payload: string | { [key: string]: string | object },
    options?: object,
  ): Promise<string> => new Promise(
    (resolve, reject) => {
      const pemPrivateKey = keyEncoder.encodePrivate(keys.privateKey, 'raw', 'pem');

      jwt.sign(payload, pemPrivateKey, options, (error: Error, token: string) => {
        if (error) reject(error);

        resolve(token);
      });
    },
  );
  return sign;
}

export function createSignWithEthersSigner(signer: Signer) {
  const sign = async (
    payload: string | { [key: string]: string | object },
    options?: object,
  ): Promise<string> => {
    const header = {
      alg: 'ES256',
      typ: 'JWT',
    };
    const encodedHeader = base64url(JSON.stringify(header));
    const encodedPayload = base64url(JSON.stringify(payload));
    const msg = `0x${Buffer.from(`${encodedHeader}.${encodedPayload}`).toString('hex')}`;
    const signature = await signer.signMessage(arrayify(keccak256(msg)));
    const encodedSignature = base64url(signature);
    return base64url(`${encodedHeader}.${encodedPayload}.${encodedSignature}`);
  };
  return sign;
}
