import { Keys } from '@ew-did-registry/keys';
import { Wallet, Signer, utils } from 'ethers';
import { Encoding, IPublicKey } from '@ew-did-registry/did-resolver-interface';

const {
  keccak256, hashMessage, arrayify, computePublicKey, recoverPublicKey,
} = utils;

export const walletPubKey = (
  { privateKey }: Wallet,
): string => new Keys({ privateKey: privateKey.slice(2) }).publicKey;

export async function signerPubKey(signer: Signer): Promise<string> {
  const msg = 'Hello';
  const hash = keccak256(msg);
  const digest = hashMessage(arrayify(hash));
  const signature = await signer.signMessage(arrayify(digest));

  return computePublicKey(recoverPublicKey(digest, signature), true).slice(2);
}

export function encodedPubKeyName(encoding: Encoding): keyof IPublicKey {
  switch (encoding) {
    case Encoding.HEX:
      return 'publicKeyHex';
    case Encoding.BASE64:
      return 'publicKeyBase64';
    case Encoding.PEM:
      return 'publicKeyPem';
    default:
      return 'publicKeyHex';
  }
}

export function hexify(value: string | object): string {
  if (typeof value === 'string' && value.startsWith('0x')) {
    return value;
  }
  return `0x${Buffer.from(typeof value === 'string'
    ? value
    : JSON.stringify(value))
    .toString('hex')}`;
}
