// eslint-disable-next-line import/no-extraneous-dependencies
import { ProviderSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import { expect } from 'chai';
import { providers, Wallet } from 'ethers';
import { signerPubKey } from '../dist';
import { EwSigner } from '../src/implementations';

describe('[RESOLVER PACKAGE]: EWSIGNER', () => {
  it('instantiation from privateKey should give publicKey with 0x prefix', async () => {
    const signer = Wallet.createRandom();
    const providerSettings: ProviderSettings = {
      type: ProviderTypes.HTTP,
    };
    expect(EwSigner.fromPrivateKey(signer.privateKey, providerSettings).publicKey.slice(0, 2)).to.equal('0x');
  });

  it('instantiation from ethersSigner should throw if publicKey does not have 0x prefix', async () => {
    const provider = new providers.JsonRpcProvider();
    const signer = Wallet.createRandom().connect(provider);
    const pubKey = await signerPubKey(signer);
    expect(pubKey.slice(0, 2)).to.not.equal('0x');
    expect(() => EwSigner.fromEthersSigner(signer, pubKey)).to.throw(Error);
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
