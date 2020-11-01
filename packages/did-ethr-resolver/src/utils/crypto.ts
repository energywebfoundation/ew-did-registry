import { Signer, utils } from 'ethers';

const {
  keccak256, hashMessage, arrayify, recoverAddress, recoverPublicKey, computePublicKey,
} = utils;

// cached public keys mapped from addresses;
export const keyOf: { [address: string]: string } = {};

// cached public keys of did owners mapped from owned did's
export const keyOfOwnerOf: { [did: string]: string } = {};

export async function getSignerPublicKey(signer: Signer): Promise<string> {
  const address = await signer.getAddress();
  let key = keyOf[address];
  if (key) {
    return key;
  }
  const hash = keccak256(address);
  const digest = hashMessage(arrayify(hash));

  const signatures = [
    await signer.signMessage(arrayify(hash)),
    await signer.signMessage(arrayify(digest)),
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const sig of signatures) {
    if (address === recoverAddress(digest, sig)) {
      key = computePublicKey(recoverPublicKey(digest, sig), true).slice(2);
      keyOf[address] = key;
      return key;
    }
  }
  return '';
}
