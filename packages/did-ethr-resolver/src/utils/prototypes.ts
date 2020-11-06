import { Signer } from 'ethers';
import { IdentityOwner } from '@ew-did-registry/did-resolver-interface';
import { Provider } from 'ethers/providers';
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

export function withProvider(signer: Signer, provider: Provider): ConnectedSigner {
  return new ConnectedSigner(signer, provider);
}
