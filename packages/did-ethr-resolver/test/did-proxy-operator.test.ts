// eslint-disable-next-line import/no-extraneous-dependencies
import { assert, expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import {
  ContractFactory, Contract, Wallet,
} from 'ethers';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IUpdateData,
  PubKeyType,
  IResolverSettings,
  IPublicKey,
  IAuthentication,
} from '@ew-did-registry/did-resolver-interface';
import { JsonRpcProvider } from 'ethers/providers';
import { proxyBuild } from '@ew-did-registry/proxyidentity';
import { ProxyOperator, ethrReg } from '../src';
import { getSettings } from '../../../tests/init-ganache';

const { abi: proxyAbi, bytecode: proxyBytecode } = proxyBuild;
const { abi: abi1056 } = ethrReg;
const { fail } = assert;
const { Authenticate, PublicKey, ServicePoint } = DIDAttribute;
const { Secp256k1, ED25519 } = Algorithms;
const { VerificationKey2018, SignatureAuthentication2018 } = PubKeyType;
const { HEX } = Encoding;

describe('[DID-PROXY-OPERATOR]', function () {
  this.timeout(0);
  const keys = new Keys();
  let operator: ProxyOperator;
  let operatorSettings: IResolverSettings;
  const validity = 10 * 60 * 1000;
  let proxy: Contract;
  let erc1056: Contract;
  const provider = new JsonRpcProvider('http://localhost:8544');
  const creator = new Wallet(keys.privateKey, provider);
  const proxyFactory = new ContractFactory(proxyAbi, proxyBytecode, creator);
  let identity: string;
  let did: string;

  before(async () => {
    operatorSettings = await getSettings([keys.getAddress()]);
    erc1056 = new Contract(operatorSettings.address, abi1056, creator);
    proxy = await (await proxyFactory.deploy(erc1056.address)).deployed();
    identity = proxy.address;
    did = `did:ewc:${identity}`;
    operator = new ProxyOperator(keys, operatorSettings, proxy.address);
  });

  it('updating an attribute without providing validity should update the document with maximum validity', async () => {
    const attribute = PublicKey;
    const updateData: IUpdateData = {
      algo: Secp256k1,
      type: VerificationKey2018,
      encoding: HEX,
      value: `0x${new Keys().publicKey}`,
    };
    await operator.update(`did:ewc:${identity}`, attribute, updateData);
    const document = await operator.read(`did:ewc:${identity}`);
    expect(document.id).equal(`did:ewc:${identity}`);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value,
    );
    expect(publicKey).is.not.undefined;
  });

  it('setting public key attribute should update public keys of DID document', async () => {
    const attribute = PublicKey;
    const updateData: IUpdateData = {
      algo: Secp256k1,
      type: VerificationKey2018,
      encoding: HEX,
      value: `0x${new Keys().publicKey}`,
    };
    await operator.update(`did:ewc:${identity}`, attribute, updateData, validity);
    const document = await operator.read(`did:ewc:${identity}`);
    expect(document.id).equal(`did:ewc:${identity}`);
    const publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value,
    );
    expect(publicKey).is.not.undefined;
  });

  it('adding a delegate with a delegation type of VerificationKey should add a public key',
    async () => {
      const attribute = Authenticate;
      const delegate = new Wallet(new Keys().privateKey);
      const updateData: IUpdateData = {
        algo: ED25519,
        type: VerificationKey2018,
        encoding: HEX,
        delegate: delegate.address,
      };
      const updated = await operator.update(did, attribute, updateData, validity);
      expect(updated).to.be.true;
      const document = await operator.read(did);
      expect(document.id).equal(did);
      const authMethod = document.publicKey.find(
        (pk: IPublicKey) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
      );
      expect(authMethod).include({
        type: 'Secp256k1VerificationKey2018',
        controller: did,
        ethereumAddress: updateData.delegate,
      });
    });

  it(`Adding a delegate with a delegation type of SignatureAuthentication should add a public
     key and reference on it in authentication section of the DID document`, async () => {
    const attribute = Authenticate;
    const delegate = new Wallet(new Keys().privateKey);
    const updateData: IUpdateData = {
      algo: ED25519,
      type: SignatureAuthentication2018,
      encoding: HEX,
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
      (pk: IPublicKey) => pk.id === publicKeyId,
    );
    expect(publicKey).include({
      type: 'Secp256k1VerificationKey2018',
      controller: did,
      ethereumAddress: updateData.delegate,
    });
  });

  it('service endpoint update should add an entry in service section of the DID document', async () => {
    const attribute = ServicePoint;
    const endpoint = 'https://test.algo.com';
    const updateData: IUpdateData = {
      type: VerificationKey2018,
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
    const attribute = PublicKey;
    const updateData: IUpdateData = {
      algo: ED25519,
      type: VerificationKey2018,
      encoding: HEX,
      value: `0x${new Keys().publicKey}`,
    };
    try {
      await operator.update(invalidDid, attribute, updateData, validity);
      fail('Error was not thrown');
    } catch (e) {
      expect(e.message).to.equal('Invalid DID');
    }
  });

  it('setting attribute with negative validity should throw an error', async () => {
    const attribute = PublicKey;
    const updateData: IUpdateData = {
      algo: ED25519,
      type: VerificationKey2018,
      encoding: HEX,
      value: `0x${new Keys().publicKey}`,
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
    let attribute = PublicKey;
    let document;
    let updateData: IUpdateData = {
      algo: ED25519,
      type: VerificationKey2018,
      encoding: HEX,
      value: `0x${new Keys().publicKey}`,
    };
    await operator.update(did, attribute, updateData, validity);
    // add authentication method
    attribute = Authenticate;
    const delegate = new Wallet(new Keys().privateKey);
    updateData = {
      algo: ED25519,
      type: SignatureAuthentication2018,
      encoding: HEX,
      delegate: delegate.address,
    };
    document = await operator.read(did);
    await operator.update(did, attribute, updateData, validity);
    // add service endpoint
    attribute = ServicePoint;
    const endpoint = 'https://example.com';
    updateData = {
      type: VerificationKey2018,
      value: endpoint,
    };
    document = await operator.read(did);
    await operator.update(did, attribute, updateData, validity);
    document = await operator.read(did);
    const result = await operator.deactivate(did);
    expect(result).to.be.true;
    document = await operator.read(did);
    expect(document.service).to.be.empty;
    expect(document.publicKey).to.be.empty;
    expect(document.authentication.length).equal(1);
  });

  it('delegate update and revocation makes no changes to the document', async () => {
    const attribute = Authenticate;
    const keysDelegate = new Keys();
    const delegate = new Wallet(keysDelegate.privateKey);
    const updateData: IUpdateData = {
      algo: ED25519,
      type: VerificationKey2018,
      encoding: HEX,
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
    const revoked = await operator.revokeDelegate(did, VerificationKey2018, delegateDid);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    authMethod = document.publicKey.find(
      (pk) => pk.id === `${did}#delegate-${updateData.type}-${updateData.delegate}`,
    );
    expect(authMethod).to.be.undefined;
  });

  it('attribute update and revocation makes no changes to the document', async () => {
    const attribute = PublicKey;
    const updateData: IUpdateData = {
      algo: ED25519,
      type: VerificationKey2018,
      encoding: HEX,
      value: `0x${new Keys().publicKey}`,
    };
    await operator.update(`did:ewc:${identity}`, attribute, updateData, validity);
    let document = await operator.read(`did:ewc:${identity}`);
    expect(document.id).equal(`did:ewc:${identity}`);
    let publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value,
    );
    expect(publicKey).to.be.not.null;
    const revoked = await operator.revokeAttribute(`did:ewc:${identity}`, attribute, updateData);
    expect(revoked).to.be.true;
    document = await operator.read(did);
    publicKey = document.publicKey.find(
      (pk) => pk.publicKeyHex === updateData.value,
    );
    expect(publicKey).to.be.undefined;
  });

  it('owner change should lead to expected result', async () => {
    const identityNewOwner = '0xe8Aa15Dd9DCf8C96cb7f75d095DE21c308D483F7';
    let currentOwner;
    await operator.changeOwner(`did:ewc:${proxy.address}`, `did:ewc:${identityNewOwner}`);
    currentOwner = await erc1056.functions.owners(proxy.address);
    expect(currentOwner).to.be.eql(identityNewOwner);
  });
});
