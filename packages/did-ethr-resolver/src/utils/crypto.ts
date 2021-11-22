import { Keys } from '@ew-did-registry/keys';
import { Wallet, Signer, utils } from 'ethers';
import { Encoding, IPublicKey } from '@ew-did-registry/did-resolver-interface';

const {
  keccak256, hashMessage, arrayify, computePublicKey, recoverPublicKey, hexlify,
} = utils;

const didPattern = `^did:[a-z0-9]+?:?[a-z0-9]+?:(0x[A-Fa-f0-9]{40})$`;
export const compressedSecp256k1KeyLength = 66;

export const walletPubKey = (
  { privateKey }: Wallet,
): string => new Keys({ privateKey: privateKey.slice(2) }).publicKey;

export async function signerPubKey(signer: Signer): Promise<string> {
  const msg = hexlify(123);
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

/**
* Checks if did is valid, and returns the address if it is
*
* @param did
* @private
*/
export function addressOf(did: string): string {
  const match = did.match(didPattern);
  if (!match) {
    throw new Error('Invalid DID');
  }
  return match[1];
}

/**
* Checks if did has a valid pattern, and returns the matched pattern array if it is
*
* @param did
* @private
*/
export function matchDIDPattern(did: string): RegExpMatchArray {
  const match = did.match(didPattern);
  if (!match) {
    throw new Error('Invalid DID');
  }
  return match;
}
