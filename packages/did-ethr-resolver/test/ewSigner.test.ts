// eslint-disable-next-line import/no-extraneous-dependencies
import { expect } from 'chai';
import { providers, Wallet } from 'ethers';
import { EwSigner } from '../src/implementations';

describe('[RESOLVER PACKAGE]: EWSIGNER', () => {
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
