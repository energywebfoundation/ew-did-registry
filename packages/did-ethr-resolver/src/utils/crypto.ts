import { Signer, utils } from "ethers";

const { keccak256, hashMessage, arrayify, recoverAddress, recoverPublicKey, computePublicKey } = utils;

export async function getSignerPublicKey(signer: Signer): Promise<string> {
  const address = await signer.getAddress();
  const hash = keccak256(address);
  const digest = hashMessage(arrayify(hash));

  const signatures = [
    await signer.signMessage(arrayify(hash)),
    await signer.signMessage(arrayify(digest))
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const sig of signatures) {
    if (address === recoverAddress(digest, sig)) {
      return computePublicKey(recoverPublicKey(digest, sig), true).slice(2);
    }
  }
  return '';
}
