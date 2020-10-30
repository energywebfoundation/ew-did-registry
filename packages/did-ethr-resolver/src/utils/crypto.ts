import { Signer, utils } from 'ethers';

const {
  keccak256, hashMessage, arrayify, recoverAddress, recoverPublicKey, computePublicKey,
} = utils;

export const cachedKeys: {
  read: { [key: string]: string };
  recovered: { [key: string]: string };
} = { read: {}, recovered: {} };

export async function getSignerPublicKey(signer: Signer): Promise<string> {
  const address = await signer.getAddress();
  let key = cachedKeys.read[address] || cachedKeys.recovered[address];
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
      cachedKeys.recovered[address] = key;
      return key;
    }
  }
  return '';
}
