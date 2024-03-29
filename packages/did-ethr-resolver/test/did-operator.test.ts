import { assert, expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { Keys, KeyType } from '@ew-did-registry/keys';
import { Wallet } from 'ethers';
import {
  DIDAttribute,
  Encoding,
  IAuthentication,
  IDIDDocument,
  IUpdateData,
  PubKeyType,
  ProviderTypes,
  ProviderSettings,
  RegistrySettings,
} from '@ew-did-registry/did-resolver-interface';
import { Methods } from '@ew-did-registry/did';
import { createSandbox } from 'sinon';
import { Operator, ethrReg } from '../src';
import { deployRegistry } from '../../../tests/init-ganache';
import { EwSigner } from '../src/implementations';

use(sinonChai);

const { fail } = assert;

const keys = new Keys({});
const providerSettings: ProviderSettings = {
  type: ProviderTypes.HTTP,
};
const owner = EwSigner.fromPrivateKey(keys.privateKey, providerSettings);

const newOwnerKeys = new Keys({});
const newOwner = EwSigner.fromPrivateKey(
  newOwnerKeys.privateKey,
  providerSettings
);

const identity = keys.getAddress();
const validity = 10 * 60 * 1000;
const did = `did:ethr:${identity}`;
const ewcDID = `did:ethr:ewc:${identity}`;
let operator: Operator;
let registry: string;
let registrySettings: RegistrySettings;

const sandbox = createSandbox();

const testSuite = (): void => {
  it('operator public key should be equal to public key of signer', () => {
    expect(operator.getPublicKey()).equal(keys.publicKey);
  });

  it('readOwnerPubKey should give same publicKey', async () => {
    expect(await operator.readOwnerPubKey(did)).equal(keys.publicKey);
  });

  it('readOwnerPubKey should give same publicKey for ewc did', async () => {
    expect(await operator.readOwnerPubKey(ewcDID)).equal(keys.publicKey);
  });

  /**
   * Spy on a method call from resolver (i.e. identityOwner())
   * This is to ensure the provider from signer is used.
   * In other words, checking that resolver using a different provider.
   */
  it("operator's resolver should use provider from signer", async () => {
    sandbox.spy(owner.provider);
    await operator.identityOwner(`did:ethr:${Wallet.createRandom().address}`);
    expect(owner.provider.getNetwork).calledOnce;
  });

  it('updating an attribute without providing validity should update the document with maximum validity', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData = {
      algo: KeyType.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-1' },
    };
    await operator.update(did, attribute, updateData);
    const document: IDIDDocument = (await operator.read(did)) as IDIDDocument;

    expect(document.id).equal(did);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey
    );
    expect(publicKey).is.not.undefined;
  });

  it('setting public key attribute should update public keys of DID document', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-2' },
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);

    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey
    );
    expect(publicKey).is.not.undefined;
  });

  it('setting public key attribute should update public keys of DID document of ewc did', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-2' },
    };
    await operator.update(ewcDID, attribute, updateData, validity);
    const document = await operator.read(ewcDID);
    expect(document.id).equal(ewcDID);

    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey
    );
    expect(publicKey).is.not.undefined;
  });

  it('adding a delegate with a delegation type of VerificationKey should add a public key', async () => {
    const attribute = DIDAttribute.Authenticate;
    const delegate = new Wallet(new Keys().privateKey);
    const updateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    const authMethod = document.publicKey.find(
      (pk: { id: string }) =>
        pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`
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
      algo: KeyType.ED25519,
      type: PubKeyType.SignatureAuthentication2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    await operator.update(did, attribute, updateData, validity);
    const document = await operator.read(did);
    expect(document.id).equal(did);
    const publicKeyId = `${did}#delegate-${updateData.type}-${updateData.delegate}`;
    const auth = document.authentication.find(
      (a) => (a as IAuthentication).publicKey === publicKeyId
    );
    expect(auth).not.undefined;
    const publicKey = document.publicKey.find(
      (pk: { id: string }) => pk.id === publicKeyId
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
    expect(
      document.service.find(
        (sv: { serviceEndpoint: string }) => sv.serviceEndpoint === endpoint
      )
    ).not.undefined;
  });

  it('It should not be possible to add service without service endpoint', async () => {
    const attribute = DIDAttribute.ServicePoint;
    const serviceId = 'UserClaimURL2';
    const updateData: IUpdateData = {
      type: attribute,
      value: {
        id: `${did}#service-${serviceId}`,
        type: 'ClaimStore',
      },
    };
    try {
      await operator.update(did, attribute, updateData, validity);
      fail('Error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal('Service Endpoint is required');
      }
    }
  });

  it('Should not add service endpoint if it exists in service section of the DID document', async () => {
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
    expect(
      document.service.find(
        (sv: { serviceEndpoint: string }) => sv.serviceEndpoint === endpoint
      )
    ).not.undefined;

    try {
      await operator.update(did, attribute, updateData, validity);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal('Service Endpoint already exist');
      }
    }
  });

  it('setting attribute on invalid did should throw an error', async () => {
    const invalidDid = `did:${identity}`;
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-3' },
    };
    try {
      await operator.update(invalidDid, attribute, updateData, validity);
      fail('Error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal('Invalid DID');
      }
    }
  });

  it('setting attribute with negative validity should throw an error', async () => {
    const attribute = DIDAttribute.PublicKey;
    const updateData: IUpdateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-4' },
    };
    try {
      await operator.update(did, attribute, updateData, -100);
      fail('Error was not thrown');
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).to.equal('Validity must be non negative value');
      }
    }
  });

  it('deactivating of document should revoke all of its attributes', async () => {
    // add public key
    let attribute = DIDAttribute.PublicKey;
    let updateData: IUpdateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-5' },
    };
    await operator.update(did, attribute, updateData, validity);
    // add authentication method
    attribute = DIDAttribute.Authenticate;
    const delegate = new Wallet(new Keys().privateKey);
    updateData = {
      algo: KeyType.ED25519,
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

  it('deactivating of document should revoke all of its attributes for ewc did', async () => {
    // add public key
    let attribute = DIDAttribute.PublicKey;
    let updateData: IUpdateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag: 'key-5' },
    };
    await operator.update(ewcDID, attribute, updateData, validity);
    // add authentication method
    attribute = DIDAttribute.Authenticate;
    const delegate = new Wallet(new Keys().privateKey);
    updateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.SignatureAuthentication2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    await operator.update(ewcDID, attribute, updateData, validity);
    // add service endpoint
    attribute = DIDAttribute.ServicePoint;
    const endpoint = 'https://example.com';
    const serviceId = 'AssetClaimURL2';
    updateData = {
      type: attribute,
      value: {
        id: `${ewcDID}#service-${serviceId}`,
        type: 'ClaimStore',
        serviceEndpoint: endpoint,
      },
    };
    await operator.update(ewcDID, attribute, updateData, validity);
    await operator.deactivate(ewcDID);
    const document = await operator.read(ewcDID);
    expect(document.service).to.be.empty;
    expect(document.publicKey).to.be.empty;
    expect(document.authentication.length).equal(1);
  });

  it('delegate update and revocation makes no changes to the document', async () => {
    const attribute = DIDAttribute.Authenticate;
    const keysDelegate = new Keys();
    const delegate = new Wallet(keysDelegate.privateKey);
    const updateData: IUpdateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: delegate.address,
    };
    await operator.update(did, attribute, updateData, validity);
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let authMethod = document.publicKey.find(
      (pk: { id: string }) =>
        pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`
    );
    expect(authMethod).include({
      type: 'Secp256k1VerificationKey2018',
      controller: did,
      ethereumAddress: updateData.delegate,
    });

    const delegateDid = `did:ethr:${delegate.address}`;
    const revoked = await operator.revokeDelegate(
      did,
      PubKeyType.VerificationKey2018,
      delegateDid
    );
    expect(revoked).to.be.true;
    document = await operator.read(did);
    authMethod = document.publicKey.find(
      (pk: { id: string }) =>
        pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`
    );
    expect(authMethod).to.be.undefined;
  });

  it('attribute update and revocation makes no changes to the document', async () => {
    const keysAttribute = new Keys();
    const attribute = DIDAttribute.PublicKey;
    const updateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: keysAttribute.publicKey, tag: 'key-6' },
    };
    await operator.update(did, attribute, updateData, validity);
    let document = await operator.read(did);
    expect(document.id).equal(did);
    let publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey.slice(2)
    );
    expect(publicKey).to.be.not.null;
    const revoked = await operator.revokeAttribute(did, attribute, updateData);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value.publicKey.slice(2)
    );
    expect(publicKey).to.be.undefined;
  });

  it('public key with invalid value should be ignored', async () => {
    const updateData = {
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: '0x123abc', tag: 'key-6' },
    };
    await operator.update(did, DIDAttribute.PublicKey, updateData, validity);
    return operator.read(did).should.not.be.rejected;
  });

  it('owner change should lead to expected result', async () => {
    const newOwnerOperator = new Operator(newOwner, { address: registry });

    await operator.changeOwner(
      `did:ethr:${identity}`,
      `did:ethr:${newOwnerKeys.getAddress()}`
    );
    expect(newOwnerKeys.getAddress()).to.be.eql(
      await operator.identityOwner(`did:ethr:${identity}`)
    );

    await newOwnerOperator.changeOwner(
      `did:ethr:${identity}`,
      `did:ethr:${identity}`
    );
    expect(identity).to.be.eql(
      await operator.identityOwner(`did:ethr:${identity}`)
    );
  });

  it('each identity update should increment its last block', async () => {
    const from = await operator.lastBlock(did);

    const updateData: IUpdateData = {
      algo: KeyType.ED25519,
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
      algo: KeyType.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: { publicKey: `0x${new Keys().publicKey}`, tag },
    };

    await operator.update(did, attribute, updateData, validity);
    await operator.update(did, attribute, updateData, 0);
    const pubKey = await operator.readAttribute(did, {
      publicKey: { id: `${did}#${tag}` },
    });

    expect(pubKey).undefined;
  });
};

describe('[RESOLVER PACKAGE]: DID-OPERATOR', function didOperatorTests() {
  this.timeout(0);

  beforeEach(async () => {
    registry = await deployRegistry([identity, newOwnerKeys.getAddress()]);
    registrySettings = {
      method: Methods.Erc1056,
      abi: ethrReg.abi,
      address: registry,
    };
    operator = new Operator(owner, registrySettings);
    await operator.create();
  });

  afterEach(() => {
    sandbox.restore();
  });

  testSuite();
});
