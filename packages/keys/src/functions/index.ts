import { createHash } from 'crypto';
import { utils } from 'ethers';
import ECKey from 'ec-key';
import { KeyType } from '../models';

const { computePublicKey } = utils;

export const hex = {
  encode: (data: string): string => {
    let result = '';

    for (let i = 0; i < data.length; i += 1) {
      const hexValue = data.charCodeAt(i).toString(16);
      result += `000${hexValue}`.slice(-4);
    }

    return result;
  },
};

export const sha256 = (data: string): string =>
  createHash('sha256').update(data).digest('hex');

const algToSecCrv = (alg: KeyType): string => {
  if (alg === KeyType.Secp256k1) {
    return 'P-256K';
  }
  if (alg === KeyType.Secp256r1) {
    return 'P-256';
  }
  throw new Error(`Algorithm ${alg} is not supported`);
};
/**
 *
 * @param key compressed or uncompressed public key or private key in hexadecimal format
 * @param keyType SECG standard curve name
 * @returns
 */
export const toPem = (key: string, keyType: KeyType): string => {
  if (!key.startsWith('0x')) {
    key = `0x${key}`;
  }
  const uncompressedPubKey = computePublicKey(key, false);
  return new ECKey({
    crv: algToSecCrv(keyType),
    publicKey: Buffer.from(uncompressedPubKey.slice(2), 'hex'),
  }).toString('pem');
};

export const privToPem = (key: string, alg: KeyType): string => {
  if (key.startsWith('0x')) {
    key = key.slice(2);
  }
  return new ECKey({
    crv: algToSecCrv(alg),
    privateKey: Buffer.from(key, 'hex'),
  }).toString('pem');
};
