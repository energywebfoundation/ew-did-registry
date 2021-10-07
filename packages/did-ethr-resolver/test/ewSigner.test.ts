// eslint-disable-next-line import/no-extraneous-dependencies
import { ProviderSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import { expect } from 'chai';
import { providers, Wallet } from 'ethers';
import { EwSigner } from '../src/implementations';

describe('[RESOLVER PACKAGE]: EWSIGNER', () => {
  it('instantiation from privateKey should give publicKey with 0x prefix', async () => {
    const signer = Wallet.createRandom();
    const providerSettings: ProviderSettings = {
      type: ProviderTypes.HTTP,
    };
    expect(() => EwSigner.fromPrivateKey(signer.privateKey, providerSettings).publicKey.slice(0, 2)).to.equal('0x');
  });

  it('instantiation from provider without signer should throw error', async () => {
    const signer = Wallet.createRandom();
    expect(() => EwSigner.fromEthersSigner(signer, '')).to.throw();
  });

  it('instantiation from signer with provider should not throw error', async () => {
    const provider = new providers.JsonRpcProvider();
    const signer = Wallet.createRandom().connect(provider);
    EwSigner.fromEthersSigner(signer, '');
  });
});
