import { Signer } from 'ethers';
import { IdentityOwner } from '@ew-did-registry/did-resolver-interface';

export function withKey(
  signer: Signer,
  fn: (signer: any) => string,
): IdentityOwner {
  const publicKey = fn(signer);
  Object.defineProperty(signer, 'publicKey', {
    get() { return publicKey; },
  });
  return signer as IdentityOwner;
}
