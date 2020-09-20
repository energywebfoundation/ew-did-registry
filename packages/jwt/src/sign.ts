import { IKeys } from '@ew-did-registry/keys';
import KeyEncoder from 'key-encoder';
import * as jwt from 'jsonwebtoken';
import { Signer } from 'ethers';
import base64url from 'base64url';

const keyEncoder = new KeyEncoder('secp256k1');

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
    const encodedHeader = JSON.stringify(header);
    const encodedPayload = JSON.stringify(payload);
    const signature = base64url(await signer.signMessage(`${encodedHeader}.${encodedPayload}`));
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  };
  return sign;
}
