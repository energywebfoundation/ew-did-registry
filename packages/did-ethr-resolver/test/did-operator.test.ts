// eslint-disable-next-line import/no-extraneous-dependencies
import { assert, expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Wallet } from 'ethers';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IAuthentication,
  IDIDDocument,
  IUpdateData,
  PubKeyType,
  ProviderTypes,
  ProviderSettings,
} from '@ew-did-registry/did-resolver-interface';
import { Methods } from '@ew-did-registry/did';
import { Operator } from '../src';
import ethrReg from '../src/constants/EthereumDIDRegistry.json';
import { deployRegistry } from '../../../tests/init-ganache';
import { EwPrivateKeySigner, IdentityOwner } from '../src/implementations';

const { fail } = assert;

const keys = new Keys({
  privateKey: '3f8118bf3224a722e55eface0c04bc8bbb7a725b3a6e38744fbfed900bbf3e7b',
});
const providerSettings: ProviderSettings = {
  type: ProviderTypes.HTTP,
};
const owner = IdentityOwner.fromPrivateKeySigner(
  new EwPrivateKeySigner(keys.privateKey, providerSettings),
);
const newOwnerKeys = new Keys({
  privateKey: 'd2d5411f96d851280a86c5c4ec23698a9fcbc630e4c5e5970d5ca55df99467ed',
  publicKey: '03c3fdf52c3897c0ee138ec5f3281919a73dbc06a2a57a2ce0c1e76b466be043ac',
});
const newOwner = IdentityOwner.fromPrivateKeySigner(
  new EwPrivateKeySigner(newOwnerKeys.privateKey, providerSettings),
);

const identity = keys.getAddress();
const validity = 10 * 60 * 1000;
const did = `did:ethr:${identity}`;
let operator: Operator;
let registry: string;

const testSuite = (): void => {
  it('operator public key should be equal to public key of signer', () => {
    expect(operator.getPublicKey()).equal(keys.publicKey);
  });

  it('updating an attribute without providing validity should update the document with maximum validity', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData = {
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
    const updateData = {
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
      const updateData = {
        algo: Algorithms.ED25519,
        type: PubKeyType.VerificationKey2018,
        encoding: Encoding.HEX,
        delegate: delegate.address,
      };
      await operator.update(did, attribute, updateData, validity);
      const document = await operator.read(did);
      expect(document.id).equal(did);
      const authMethod = document.publicKey.find(
        (pk: { id: string }) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
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
    const updateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.SignatureAuthentication2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    const publicKeyId = `${did}#delegate-${updateData.type}-${updateData.delegate}`;
    const auth = document.authentication.find(
      (a) => (a as IAuthentication).publicKey === publicKeyId,
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
      type: attribute,
      value: {
        id: `${did}#service-${serviceId}`,
        type: 'ClaimStore',
        serviceEndpoint: endpoint,
      },
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    expect(document.service.find(
      (sv: { serviceEndpoint: string }) => sv.serviceEndpoint === endpoint,
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

  it('deactivating of document should revoke all of its attributes', async () => {
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
      type: attribute,
      value: {
        id: `${did}#service-${serviceId}`,
        type: 'ClaimStore',
        serviceEndpoint: endpoint,
      },
    };
    await operator.update(did, attribute, updateData, validity);
    await operator.deactivate(did);
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
    await operator.update(did, attribute, updateData, validity);
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let authMethod = document.publicKey.find(
      (pk: { id: string }) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
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
      (pk: { id: string }) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
    );
    expect(authMethod).to.be.undefined;
  });

  it('attribute update and revocation makes no changes to the document', async () => {
    const keysAttribute = new Keys();
    const attribute = DIDAttribute.PublicKey;
    const updateData = {
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
    const updateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: '0x123abc', tag: 'key-6' },
    };
    await operator.update(did, DIDAttribute.PublicKey, updateData, validity);
    return operator.read(did).should.not.be.rejected;
  });

  it('owner change should lead to expected result', async () => {
    const newOwnerOperator = new Operator(
      newOwner,
      { address: registry },
    );

    await operator.changeOwner(`did:ethr:${identity}`, `did:ethr:${newOwnerKeys.getAddress()}`);
    expect(newOwnerKeys.getAddress()).to.be.eql(await operator.identityOwner(`did:ethr:${identity}`));

    await newOwnerOperator.changeOwner(`did:ethr:${identity}`, `did:ethr:${identity}`);
    expect(identity).to.be.eql(await operator.identityOwner(`did:ethr:${identity}`));
  });

  it('each identity update should increment its last block', async () => {
    const from = await operator.lastBlock(did);

    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-1' },
    };

    await operator.update(did, DIDAttribute.PublicKey, updateData, validity);
    expect((await operator.lastBlock(did)).eq(from.add(1)));

    await operator.update(did, DIDAttribute.PublicKey, updateData, validity);
    expect((await operator.lastBlock(did)).eq(from.add(2)));
  });

  it('attribute updated with zero validity should not be read', async () => {
    const tag = 'key-2';
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag },
    };

    await operator.update(did, attribute, updateData, validity);
    await operator.update(did, attribute, updateData, 0);
    const pubKey = await operator.readAttribute(did, { publicKey: { id: `${did}#${tag}` } });

    expect(pubKey).undefined;
  });
};

describe('[RESOLVER PACKAGE]: DID-OPERATOR', function didOperatorTests() {
  this.timeout(0);

  beforeEach(async () => {
    registry = await deployRegistry([identity, newOwnerKeys.getAddress()]);
    operator = new Operator(
      owner,
      { method: Methods.Erc1056, abi: ethrReg.abi, address: registry },
    );
    await operator.create();
  });

  testSuite();
});
