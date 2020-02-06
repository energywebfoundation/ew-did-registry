// eslint-disable-next-line import/no-extraneous-dependencies
import { assert, expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Wallet, ContractFactory, ethers } from 'ethers';
import Web3 from 'web3';
import {ethrReg} from '../src/constants/EthereumDIDRegistry';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IUpdateData,
  PubKeyType,
  Operator,
  IAuthentication, IResolverSettings,
} from '../src';
import { defaultResolverSettings } from '../src/constants';

const { fail } = assert;
describe('[DID-OPERATOR]', function () {
  const GANACHE_PORT = 8543;
  const web3 = new Web3(`http://localhost:${GANACHE_PORT}`);
  this.timeout(0);
  const keys = new Keys({
    privateKey: '49d484400c2b86a89d54f26424c8cbd66a477a6310d7d4a3ab9cbd89633b902c',
    publicKey: '023d6e5b341099c21cd4093ebe3228dc80a2785479b8211d20399698f61ee264d0',
  });
  let operator: Operator;
  let operatorSetting: IResolverSettings;
  const identity = '0x37155f6d56b3be462bbd6b154c5E960D19827167';
  const validity = 10 * 60 * 1000;
  const did = `did:ewc:${identity}`;

  before(async () => {
    const accounts = await web3.eth.getAccounts();
    await web3.eth.sendTransaction({
      from: accounts[2],
      to: identity,
      value: '1000000000000000000',
    });
    await web3.eth.sendTransaction({
      from: accounts[3],
      to: '0xe8Aa15Dd9DCf8C96cb7f75d095DE21c308D483F7',
      value: '10000000000000000',
    });

    const provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
    const registryFactory = new ContractFactory(ethrReg.abi, ethrReg.bytecode,
      new Wallet('0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b', provider));
    const registry = await registryFactory.deploy();
    operatorSetting = {
      abi: defaultResolverSettings.abi,
      provider: defaultResolverSettings.provider,
      address: registry.address,
    };
    operator = new Operator(keys, operatorSetting);
    console.log(`registry: ${registry.address}`);
  });

  it('updating an attribute without providing validity should update the document with maximum validity', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: new Keys().publicKey,
    };
    await operator.update(did, attribute, updateData);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value,
    );
    expect(publicKey).is.not.undefined;
  });

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
      (pk) => pk.publicKeyHex === updateData.value,
    );
    expect(publicKey).is.not.undefined;
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
        (pk) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
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
    const publicKeyId = `${did}#delegate-${updateData.type}-${updateData.delegate}`;
    const auth = document.authentication.find(
      (a: IAuthentication) => a.publicKey === publicKeyId,
    );
    expect(auth).not.undefined;
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
    const endpoint = 'https://test.algo.com';
    const updateData: IUpdateData = {
      type: PubKeyType.VerificationKey2018,
      value: endpoint,
    };
    const updated = await operator.update(did, attribute, updateData, validity);
    expect(updated).to.be.true;
    const document = await operator.read(did);
    expect(document.id).equal(did);
    expect(document.service.find(
      (sv) => sv.serviceEndpoint === endpoint,
    )).not.undefined;
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
      type: PubKeyType.VerificationKey2018,
      value: endpoint,
    };
    await operator.update(did, attribute, updateData, validity);
    let document = await operator.read(did);
    const result = await operator.deactivate(did);
    expect(result).to.be.true;
    document = await operator.read(did);
    expect(document.service).to.be.empty;
    expect(document.publicKey).to.be.empty;
    expect(document.authentication.length).equal(1);
  });

  it('delegate update and revocation makes no changes to the document', async () => {
    const attribute = DIDAttribute.Authenticate;
    const keysDelegate = new Keys();
    const delegate = new Wallet(keysDelegate.privateKey);
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    const updated = await operator.update(did, attribute, updateData, validity);
    expect(updated).to.be.true;
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let authMethod = document.publicKey.find(
      (pk) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
    );
    expect(authMethod).include({
      type: 'Secp256k1VerificationKey2018',
      controller: did,
      ethereumAddress: updateData.delegate,
    });

    const delegateDid = `did:ewc:${delegate.address}`;
    const revoked = await operator.revokeDelegate(did, PubKeyType.VerificationKey2018, delegateDid);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    authMethod = document.publicKey.find(
      (pk) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
    );
    expect(authMethod).to.be.undefined;
  });

  it('attribute update and revocation makes no changes to the document', async () => {
    const keysAttribute = new Keys();
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: keysAttribute.publicKey,
    };
    await operator.update(did, attribute, updateData, validity);
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.slice(2),
    );
    expect(publicKey).to.be.not.null;
    const revoked = await operator.revokeAttribute(did, attribute, updateData);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.slice(2),
    );
    expect(publicKey).to.be.undefined;
  });

  it('owner change should lead to expected result', async () => {
    const secondKeys = new Keys({
      privateKey: 'd2d5411f96d851280a86c5c4ec23698a9fcbc630e4c5e5970d5ca55df99467ed',
      publicKey: '03c3fdf52c3897c0ee138ec5f3281919a73dbc06a2a57a2ce0c1e76b466be043ac',
    });
    const identityNewOwner = '0xe8Aa15Dd9DCf8C96cb7f75d095DE21c308D483F7';
    const operatorNewOwner = new Operator(secondKeys, operatorSetting);
    let currentOwner;

    await operator.changeOwner(`did:ewc:${identity}`, `did:ewc:${identityNewOwner}`);
    currentOwner = await operator.identityOwner(`did:ewc:${identity}`);
    expect(currentOwner).to.be.eql(identityNewOwner);

    await operatorNewOwner.changeOwner(`did:ewc:${identity}`, `did:ewc:${identity}`);
    currentOwner = await operator.identityOwner(`did:ewc:${identity}`);
    expect(currentOwner).to.be.eql(identity);
  });
});
