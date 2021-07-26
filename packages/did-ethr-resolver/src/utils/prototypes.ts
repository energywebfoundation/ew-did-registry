import { Signer, providers } from 'ethers';
import { IdentityOwner } from '@ew-did-registry/did-resolver-interface';
import { ConnectedSigner } from './signers';

export function withKey(
  signer: Signer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (signer: any) => string,
): IdentityOwner {
  const publicKey = fn(signer);
  Object.defineProperty(signer, 'publicKey', {
    get() { return publicKey; },
  });
  return signer as IdentityOwner;
}

export function withProvider(signer: Signer, provider: providers.Provider): ConnectedSigner {
  return new ConnectedSigner(signer, provider);
}
