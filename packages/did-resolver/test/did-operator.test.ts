// eslint-disable-next-line import/no-extraneous-dependencies
import { assert, expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Wallet } from 'ethers';
import {
  Algorithms, DIDAttribute, Encoding, IUpdateData, PubKeyType, Operator, IAuthentication,
} from '../src';
// import { IAuthentication } from '../src/models';

const { fail } = assert;
describe('[DID-OPERATOR]', function () {
  this.timeout(0);
  const keys = new Keys({
    privateKey: '9a843e79a455a368c3031ffc3974e04e04f0553f2464b89074f901dea713c357',
    publicKey: '0361652cea564db2c9ef4d5859705376cbe5628e47490022a3b4535764d3f08efe',
  });
  const operator = new Operator(keys);
  const identity = '0x0126B7A16967114f3E261c36E9D99629D73caAeA';
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
    const result = await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    // console.log('document:', document);
    expect(document.id).equal(did);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.slice(2),
    );
    // console.log('public key:', publicKey);
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
      // console.log('document:', document);
      expect(document.id).equal(did);
      const authMethod = document.publicKey.find(
        (pk) => pk.id === `${did}#delegate-${updateData.delegate}`,
      );
      // console.log('auth method:', authMethod);
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
    // console.log('document:', document);
    expect(document.id).equal(did);
    const publicKeyId = `${did}#delegate-${updateData.delegate}`;
    const auth = document.authentication.find(
      (a: IAuthentication) => a.publicKey === publicKeyId,
    );
    expect(auth).not.null;
    const publicKey = document.publicKey.find(
      (pk) => pk.id === publicKeyId,
    );
    // console.log('auth method:', authMethod);
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
    // console.log('document:', document);
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
      const result = await operator.update(invalidDid, attribute, updateData, validity);
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
});
