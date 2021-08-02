import { Signer, providers } from 'ethers';
import { IdentityOwner } from '@fl-did-registry/did-resolver-interface';
import { ConnectedSigner } from './signers';

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

export function withProvider(signer: Signer, provider: providers.Provider): ConnectedSigner {
  return new ConnectedSigner(signer, provider);
}
