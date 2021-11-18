import { Keys } from '@ew-did-registry/keys';
import { Wallet, Signer, utils } from 'ethers';
import { Encoding, IPublicKey } from '@ew-did-registry/did-resolver-interface';
// importing Methods and ethAddrPattern temporarily to be used in did patterns
import { DIDPattern, ethAddrPattern, Methods } from '@ew-did-registry/did';

const {
  keccak256, hashMessage, arrayify, computePublicKey, recoverPublicKey, hexlify,
} = utils;

// temporary declaration, to be imported from @ew-did-registry/did after new publish
export const DIDPatternEWC = `^did:${Methods.Erc1056}:ewc:(${ethAddrPattern})$`;
export const DIDPatternVOLTA = `^did:${Methods.Erc1056}:volta:(${ethAddrPattern})$`;

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
  let match;
  if (did.split(':').length > 3) {
    if (did.includes('ewc')) {
      match = did.match(DIDPatternEWC);
    }
    else if (did.includes('volta')) {
      match = did.match(DIDPatternVOLTA);
    }
  }
  else {
    match = did.match(DIDPattern);
  }
  if (!match) {
    throw new Error('Invalid DID');
  }
  return match[1];
}
