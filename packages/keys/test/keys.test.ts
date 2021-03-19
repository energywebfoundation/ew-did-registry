import { expect } from 'chai';

import { Keys } from '../src';
import { ECDSA_PATTERNS } from '../src/models';

describe('[KEYS PACKAGE]', () => {
  it('generation should return object with private and public key', () => {
    const keyPair = Keys.generateKeyPair();

    expect(keyPair.privateKey).to.match(ECDSA_PATTERNS.secp256k1.PRIVATE_KEY);
    expect(keyPair.publicKey).to.match(ECDSA_PATTERNS.secp256k1.PUBLIC_KEY);
  });

  it('construct new keys without private and public keys', () => {
    const keys = new Keys();

    expect(keys.privateKey).to.match(ECDSA_PATTERNS.secp256k1.PRIVATE_KEY);
    expect(keys.publicKey).to.match(ECDSA_PATTERNS.secp256k1.PUBLIC_KEY);
  });

  it('construct new keys with private key', () => {
    const keyPair = Keys.generateKeyPair();
    const keys = new Keys({ privateKey: keyPair.privateKey });

    expect(keys.privateKey).is.equal(keyPair.privateKey);
    expect(keys.privateKey).to.match(ECDSA_PATTERNS.secp256k1.PRIVATE_KEY);
    expect(keys.publicKey).to.match(ECDSA_PATTERNS.secp256k1.PUBLIC_KEY);
  });

  it('construct new keys with public key', () => {
    const keyPair = Keys.generateKeyPair();
    const keys = new Keys({ publicKey: keyPair.publicKey });

    expect(keys.privateKey).is.equal('');
    expect(keys.publicKey).to.match(ECDSA_PATTERNS.secp256k1.PUBLIC_KEY);
  });

  it('construct new keys with private and public keys', () => {
    const keyPair = Keys.generateKeyPair();
    const keys = new Keys({
      privateKey: keyPair.privateKey,
      publicKey: keyPair.publicKey,
    });

    expect(keys.privateKey).is.equal(keyPair.privateKey);
    expect(keys.publicKey).is.equal(keyPair.publicKey);
    expect(keys.privateKey).to.match(ECDSA_PATTERNS.secp256k1.PRIVATE_KEY);
    expect(keys.publicKey).to.match(ECDSA_PATTERNS.secp256k1.PUBLIC_KEY);
  });

  it('sign the data', () => {
    const keys = new Keys();
    const data = 'test';
    const signature = keys.sign(data);
    expect(signature).to.match(ECDSA_PATTERNS.secp256k1.SIGNATURE);
  });

  it('verify the data with valid signature', () => {
    const keys = new Keys();
    const data = 'test';
    const signature = keys.sign(data);
    expect(keys.verify(data, signature)).is.true;
  });

  it('verify the data with valid signature and provided public key', () => {
    const keysAlice = new Keys();
    const keysBob = new Keys();
    const data = 'test';
    const signature = keysAlice.sign(data);
    expect(keysBob.verify(data, signature, keysAlice.publicKey)).is.true;
  });

  it('verify the data with invalid signature', () => {
    const keysAlice = new Keys();
    const keysBob = new Keys();
    const data = 'test';
    const signature = keysAlice.sign(data);
    expect(keysBob.verify(data, signature)).is.false;
  });

  it('encrypt the data', async () => {
    const keysAlice = new Keys();
    const keysBob = new Keys();
    const data = 'test';
    const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
    expect(encrypted).to.match(/^[a-f0-9]+$/);
  });

  it('decrypt the data', async () => {
    const keysAlice = new Keys();
    const keysBob = new Keys();
    const data = 'test';
    const encrypted = await keysAlice.encrypt(data, keysBob.publicKey);
    const decrypted = await keysBob.decrypt(encrypted);
    expect(decrypted).is.equal(data);
  });
});
