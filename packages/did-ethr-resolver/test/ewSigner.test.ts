// eslint-disable-next-line import/no-extraneous-dependencies
import { ProviderSettings, ProviderTypes } from '@ew-did-registry/did-resolver-interface';
import { expect } from 'chai';
import { providers, Wallet } from 'ethers';
import { signerPubKey } from '../dist';
import { EwSigner } from '../src/implementations';

const SECP256K1_COMRESSED_KEY_LENGTH = 66;

describe('[RESOLVER PACKAGE]: EWSIGNER', () => {
  it('instantiation from privateKey should give publicKey without 0x prefix and 66 char length', async () => {
    const signer = Wallet.createRandom();
    const providerSettings: ProviderSettings = {
      type: ProviderTypes.HTTP,
    };
    const ewSignerPubKey = EwSigner.fromPrivateKey(signer.privateKey, providerSettings).publicKey;
    expect(ewSignerPubKey.slice(0, 2)).to.not.equal('0x');
    expect(ewSignerPubKey).to.be.lengthOf(SECP256K1_COMRESSED_KEY_LENGTH);
  });

  it('instantiation from ethers signer with non-prefixed key does not add prefix', async () => {
    const provider = new providers.JsonRpcProvider();
    const signer = Wallet.createRandom().connect(provider);
    const pubKey = await signerPubKey(signer);
    expect(pubKey.slice(0, 2)).to.not.equal('0x');
    const ewSignerPubKey = EwSigner.fromEthersSigner(signer, pubKey).publicKey;
    expect(ewSignerPubKey).to.equal(pubKey);
    expect(ewSignerPubKey).to.be.lengthOf(SECP256K1_COMRESSED_KEY_LENGTH);
  });

  it('instantiation from ethers signer with prefixed key removes prefix', async () => {
    const provider = new providers.JsonRpcProvider();
    const signer = Wallet.createRandom().connect(provider);
    const pubKey = await signerPubKey(signer);
    expect(pubKey.slice(0, 2)).to.not.equal('0x');
    const prefixedKey = `0x${pubKey}`;
    const ewSignerPubKey = EwSigner.fromEthersSigner(signer, prefixedKey).publicKey;
    expect(ewSignerPubKey).to.equal(pubKey);
    expect(ewSignerPubKey).to.be.lengthOf(SECP256K1_COMRESSED_KEY_LENGTH);
  });

  it('instantiation from ethers signer should throw if publicKey is not valid secp256k1 key', async () => {
    const provider = new providers.JsonRpcProvider();
    const signer = Wallet.createRandom().connect(provider);
    const pubKey = '0x123';
    expect(() => EwSigner.fromEthersSigner(signer, pubKey)).to.throw(Error);
  });

  it('instantiation from ethers signer without provider should throw error', async () => {
    const signer = Wallet.createRandom();
    expect(() => EwSigner.fromEthersSigner(signer, '')).to.throw();
  });

  it('instantiation from ethers signer with empty public key should throw error', async () => {
    const provider = new providers.JsonRpcProvider();
    const signer = Wallet.createRandom().connect(provider);
    expect(() => EwSigner.fromEthersSigner(signer, '')).to.throw();
  });

  it('instantiation from ethers signer with provider should not throw error', async () => {
    const provider = new providers.JsonRpcProvider();
    const signer = Wallet.createRandom().connect(provider);
    const pubKey = await signerPubKey(signer);
    EwSigner.fromEthersSigner(signer, pubKey);
  });
});
