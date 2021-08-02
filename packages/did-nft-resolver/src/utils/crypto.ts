import { Keys } from '@fl-did-registry/keys';
import { Wallet, Signer, utils } from 'ethers';
import { Encoding, IVerificationMethod } from '@fl-did-registry/did-resolver-interface';
import { DIDPattern, DIDEthrPattern } from '@fl-did-registry/did';
import crypto from 'crypto';

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

export function encodedPubKeyName(encoding: Encoding): keyof IVerificationMethod {
  switch (encoding) {
    case Encoding.HEX:
      return 'publicKeyHex';
    case Encoding.BASE64:
      return 'publicKeyBase64';
    case Encoding.PEM:
      return 'publicKeyPem';
    case Encoding.ETHADDR:
      return 'ethereumAddress'
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
export function addressAndIdOf(did: string): [string, string] {
  const match = did.match(DIDPattern);
  if (!match) {
    throw new Error('Invalid DID');
  }
  return [match[1], match[2]];
}

export function addressOf(did: string): string {
  const match = did.match(DIDEthrPattern);
  if (!match) {
    throw new Error('Invalid DID');
  }
  return match[1];
}


export const hashes: { [hashAlg: string]: (data: string) => string } = {
  SHA256: (data: string): string => crypto.createHash('sha256').update(data).digest('hex'),
};
