// eslint-disable-next-line import/no-extraneous-dependencies
import { assert, expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { ethers, Wallet } from 'ethers';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IUpdateData,
  PubKeyType,
  Operator,
  IAuthentication,
  DelegateTypes,
} from '../src';
import { defaultResolverSettings } from '../src/constants';

const { fail } = assert;
describe('[DID-OPERATOR]', function () {
  this.timeout(0);
  const keys = new Keys({
    privateKey: '0b4e103fe261142b716fc5c055edf1e70d4665080395dbe5992af03235f9e511',
    publicKey: '02963497c702612b675707c0757e82b93df912261cd06f6a51e6c5419ac1aa9bcc',
  });
  const operator = new Operator(keys);
  const identity = '0xed6011BBaB3B98cF955ff271F52B12B94BF9fD28';
  const validity = 10 * 60 * 1000;
  const did = `did:ewc:${identity}`;

  it('setting public key attribute should update public keys of DID document', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: new Keys().publicKey,
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.slice(2),
    );
    // eslint-disable-next-line no-unused-expressions
    expect(publicKey).not.null;
  });

  it('adding a delegate with a delegation type of VerificationKey should add a public key',
    async () => {
      const attribute = DIDAttribute.Authenticate;
      const delegate = new Wallet(new Keys().privateKey);
      const updateData: IUpdateData = {
        algo: Algorithms.ED25519,
        type: PubKeyType.VerificationKey2018,
        encoding: Encoding.HEX,
        delegate: delegate.address,
      };
      const updated = await operator.update(did, attribute, updateData, validity);
      expect(updated).to.be.true;
      const document = await operator.read(did);
      expect(document.id).equal(did);
      const authMethod = document.publicKey.find(
        (pk) => pk.id === `${did}#delegate-${updateData.delegate}`,
      );
      expect(authMethod).include({
        type: 'Secp256k1VerificationKey2018',
        controller: did,
        ethereumAddress: updateData.delegate,
      });
    });

  it(`Adding a delegate with a delegation type of SignatureAuthentication should add a public
     key and reference on it in authentication section of the DID document`, async () => {
    const attribute = DIDAttribute.Authenticate;
    const delegate = new Wallet(new Keys().privateKey);
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.SignatureAuthentication2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    const updated = await operator.update(did, attribute, updateData, validity);
    expect(updated).to.be.true;
    const document = await operator.read(did);
    expect(document.id).equal(did);
    const publicKeyId = `${did}#delegate-${updateData.delegate}`;
    const auth = document.authentication.find(
      (a: IAuthentication) => a.publicKey === publicKeyId,
    );
    expect(auth).not.null;
    const publicKey = document.publicKey.find(
      (pk) => pk.id === publicKeyId,
    );
    expect(publicKey).include({
      type: 'Secp256k1VerificationKey2018',
      controller: did,
      ethereumAddress: updateData.delegate,
    });
  });

  it('service endpoint update should add an entry in service section of the DID document', async () => {
    const attribute = DIDAttribute.ServicePoint;
    const endpoint = 'https://example.com';
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: endpoint,
    };
    const updated = await operator.update(did, attribute, updateData, validity);
    expect(updated).to.be.true;
    const document = await operator.read(did);
    expect(document.id).equal(did);
    expect(document.service.find(
      (sv) => sv.type === updateData.algo && sv.serviceEndpoint === endpoint,
    )).not.null;
  });

  it('setting attribute on invalid did should throw an error', async () => {
    const invalidDid = `did:${identity}`;
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: new Keys().publicKey,
    };
    try {
      await operator.update(invalidDid, attribute, updateData, validity);
      fail('Error was not thrown');
    } catch (e) {
      expect(e.message).to.equal('Invalid DID');
    }
  });

  it('setting attribute with negative validity should throw an error', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: new Keys().publicKey,
    };
    try {
      await operator.update(did, attribute, updateData, -100);
      fail(
        'Error was not thrown',
      );
    } catch (e) {
      expect(e.message).to.equal('Validity must be non negative value');
    }
  });

  it('deactivating of document should resolve with true', async () => {
    // add public key
    let attribute = DIDAttribute.PublicKey;
    let updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: new Keys().publicKey,
    };
    await operator.update(did, attribute, updateData, validity);
    // add authentication method
    attribute = DIDAttribute.Authenticate;
    const delegate = new Wallet(new Keys().privateKey);
    updateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.SignatureAuthentication2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    await operator.update(did, attribute, updateData, validity);
    // add service endpoint
    attribute = DIDAttribute.ServicePoint;
    const endpoint = 'https://example.com';
    updateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: endpoint,
    };
    await operator.update(did, attribute, updateData, validity);
    let document = await operator.read(did);
    const result = await operator.deactivate(did);
    expect(result).to.be.true;
    document = await operator.read(did);
    expect(document.service).to.be.empty;
    expect(document.publicKey.length).equal(1);
    expect(document.authentication.length).equal(1);
  });

  it('delegate revocation creates an event', async () => {
    const keysDelegate = new Keys();
    const newDid = `did:ewc:0x${keysDelegate.publicKey.slice(26)}`;
    const revoked = await operator.revokeDelegate(did, DelegateTypes.verification, newDid);
    expect(revoked).to.be.true;
  });

  it('attribute revocation creates an event', async () => {
    const keysDelegate = new Keys();
    const newDid = `did:ewc:0x${keysDelegate.publicKey.slice(26)}`;
    const revoked = await operator.revokeAttribute(did, DIDAttribute.Authenticate, newDid);
    expect(revoked).to.be.true;
  });

  it('owner change should lead to expected result', async () => {
    const secondKeys = new Keys({
      privateKey: 'd2d5411f96d851280a86c5c4ec23698a9fcbc630e4c5e5970d5ca55df99467ed',
      publicKey: '03c3fdf52c3897c0ee138ec5f3281919a73dbc06a2a57a2ce0c1e76b466be043ac',
    });
    const identityNewOwner = '0xe8Aa15Dd9DCf8C96cb7f75d095DE21c308D483F7';
    const operatorNewOwner = new Operator(secondKeys);
    let currentOwner;

    await operator.changeOwner(`did:ewc:${identity}`, `did:ewc:${identityNewOwner}`);
    currentOwner = await operator.identityOwner(`did:ewc:${identity}`);
    expect(currentOwner).to.be.eql(identityNewOwner);

    await operatorNewOwner.changeOwner(`did:ewc:${identity}`, `did:ewc:${identity}`);
    currentOwner = await operator.identityOwner(`did:ewc:${identity}`);
    expect(currentOwner).to.be.eql(identity);
  });
});
