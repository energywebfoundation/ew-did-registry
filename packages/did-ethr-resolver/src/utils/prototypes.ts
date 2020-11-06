import { ethers, Signer } from 'ethers';
import { IdentityOwner } from '@ew-did-registry/did-resolver-interface';
import { Provider } from 'ethers/providers';
import { ConnectedSigner } from './signers';

declare module 'ethers' {
  export interface Signer {
    withKey(fn: (signer: any) => string): IdentityOwner;
    withProvider(provider: Provider): ConnectedSigner;
  }
}

ethers.Signer.prototype.withKey = function withKey(
  fn: (signer: any) => string,
): IdentityOwner {
  const publicKey = fn(this);
  Object.defineProperty(this, 'publicKey', {
    get() { return publicKey; },
  });
  return this;
};

ethers.Signer.prototype.withProvider = function connect(provider: Provider): ConnectedSigner {
  return new ConnectedSigner(this, provider);
};
