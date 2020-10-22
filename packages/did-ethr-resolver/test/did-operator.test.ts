// eslint-disable-next-line import/no-extraneous-dependencies
import { assert, expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Wallet, providers, Signer } from 'ethers';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IAuthentication,
  IDIDDocument,
  IResolverSettings,
  IUpdateData,
  PubKeyType,
} from '@ew-did-registry/did-resolver-interface';
import { Operator } from '../src';
import { getSettings } from '../../../tests/init-ganache';

const { fail } = assert;

const keys = new Keys({
  privateKey: '3f8118bf3224a722e55eface0c04bc8bbb7a725b3a6e38744fbfed900bbf3e7b',
});
const newOwnerKeys = new Keys({
  privateKey: 'd2d5411f96d851280a86c5c4ec23698a9fcbc630e4c5e5970d5ca55df99467ed',
  publicKey: '03c3fdf52c3897c0ee138ec5f3281919a73dbc06a2a57a2ce0c1e76b466be043ac',
});
const identity = keys.getAddress();
const validity = 10 * 60 * 1000;
const did = `did:ethr:${identity}`;
let operator: Operator;
let operatorSettings: IResolverSettings;

const testSuite = (): void => {
  it('operator public key should be equl to public key of signer', async () => {
    expect(await (await operator.getPublicKey()).slice(2)).equal(keys.publicKey.slice(2));
  });

  it('updating an attribute without providing validity should update the document with maximum validity', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-1' },
    };
    await operator.update(did, attribute, updateData);
    const document: IDIDDocument = await operator.read(did) as IDIDDocument;
    expect(document.id).equal(did);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey,
    );
    expect(publicKey).is.not.undefined;
  });

  it('setting public key attribute should update public keys of DID document', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-2' },
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey,
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
        (pk: { id: string; }) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
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
      (pk: { id: string }) => pk.id === publicKeyId,
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
    const serviceId = 'UserClaimURL1';
    const updateData: IUpdateData = {
      type: 'ClaimStore',
      value: { id: `${did}#service-${serviceId}`, serviceEndpoint: endpoint },
    };
    const updated = await operator.update(did, attribute, updateData, validity);
    expect(updated).to.be.true;
    const document = await operator.read(did);
    expect(document.id).equal(did);
    expect(document.service.find(
      (sv: { serviceEndpoint: string; }) => sv.serviceEndpoint === endpoint,
    )).not.undefined;
  });

  it('setting attribute on invalid did should throw an error', async () => {
    const invalidDid = `did:${identity}`;
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-3' },
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
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-4' },
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
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-5' },
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
    const serviceId = 'AssetClaimURL2';
    updateData = {
      type: 'ClaimStore',
      value: { id: `${did}#service-${serviceId}` ,serviceEndpoint: endpoint },
    };
    await operator.update(did, attribute, updateData, validity);
    const result = await operator.deactivate(did);
    expect(result).to.be.true;
    const document = await operator.read(did);
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
      (pk: { id: string; }) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
    );
    expect(authMethod).include({
      type: 'Secp256k1VerificationKey2018',
      controller: did,
      ethereumAddress: updateData.delegate,
    });

    const delegateDid = `did:ethr:${delegate.address}`;
    const revoked = await operator.revokeDelegate(did, PubKeyType.VerificationKey2018, delegateDid);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    authMethod = document.publicKey.find(
      (pk: { id: string; }) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
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
      value: { publicKey: keysAttribute.publicKey, tag: 'key-6' },
    };
    await operator.update(did, attribute, updateData, validity);
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey.slice(2),
    );
    expect(publicKey).to.be.not.null;
    const revoked = await operator.revokeAttribute(did, attribute, updateData);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey.slice(2),
    );
    expect(publicKey).to.be.undefined;
  });

  it('public key with invalid value should be ignored', async () => {
    const updateData: any = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: '0x123abc',
    };
    await operator.update(did, DIDAttribute.PublicKey, updateData, validity);
    return operator.read(did).should.not.be.rejected;
  });

  it('owner change should lead to expected result', async () => {
    const newOwnerOperator = new Operator(newOwnerKeys, operatorSettings);

    await operator.changeOwner(`did:ethr:${identity}`, `did:ethr:${newOwnerKeys.getAddress()}`);
    expect(newOwnerKeys.getAddress()).to.be.eql(await operator.identityOwner(`did:ethr:${identity}`));

    await newOwnerOperator.changeOwner(`did:ethr:${identity}`, `did:ethr:${identity}`);
    expect(identity).to.be.eql(await operator.identityOwner(`did:ethr:${identity}`));
  });
};

describe('[DID-OPERATOR: sign method Keys]', function () {
  this.timeout(0);

  before(async () => {
    operatorSettings = await getSettings([identity, newOwnerKeys.getAddress()]);
    console.log(`registry: ${operatorSettings.address}`);
    operator = new Operator(keys, operatorSettings);
  });

  testSuite();
});

describe('[DID-OPERATOR: sign method Signer]', function () {
  this.timeout(0);
  let signer: Signer;

  before(async () => {
    operatorSettings = await getSettings([identity, newOwnerKeys.getAddress()]);
    const provider = new providers.JsonRpcProvider(
      operatorSettings.provider.uriOrInfo,
      operatorSettings.provider.network,
    );
    signer = new Wallet(keys.privateKey, provider);
    operator = new Operator(signer, operatorSettings);
    await operator.create();
  });

  testSuite();

  it('public key recovered from address signed by WalletConnect Signer should be equal to connected account key', async () => {
    expect(keys.publicKey).to.be.equal(await operator.getPublicKey());
  });
});
