import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Keys } from '@ew-did-registry/keys';
import Web3 from 'web3';
import { ContractFactory, ethers, Wallet } from 'ethers';
import {
  Resolver,
  IResolver,
  DelegateTypes,
  Operator, IResolverSettings,
} from '../src';
import {ethrReg} from '../src/constants/EthereumDIDRegistry';
import { defaultResolverSettings } from '../src/constants';

describe('[RESOLVER PACKAGE]', function () {
  this.timeout(60000);
  let resolver: IResolver;
  const GANACHE_PORT = 8543;
  const web3 = new Web3(`http://localhost:${GANACHE_PORT}`);
  const keys = new Keys({
    privateKey: '49d484400c2b86a89d54f26424c8cbd66a477a6310d7d4a3ab9cbd89633b902c',
    publicKey: '023d6e5b341099c21cd4093ebe3228dc80a2785479b8211d20399698f61ee264d0',
  });
  let operator: Operator;
  let operatorSetting: IResolverSettings;

  before(async () => {
    chai.should();
    chai.use(chaiAsPromised);

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

  beforeEach(() => {
    resolver = new Resolver(operatorSetting);
  });

  it('invalid did should throw an error', async () => {
    const invalidDidFirst = 'did:ewc1:0xe2e457aB987BEd9AbdEE9410FC985E46e28a394~';
    resolver.read(invalidDidFirst).catch((error) => {
      expect(error.toString()).to.equal('Error: Invalid did provided');
    });

    const invalidDidSecond = 'did:ewc1:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3944352749528734062daagdsgasdbv';
    resolver.read(invalidDidSecond).catch((error) => {
      expect(error.toString()).to.equal('Error: Invalid did provided');
    });
  });

  it('expect any valid did to have a document', async () => {
    const did = 'did:ewc:0x0000000000000000000000000000000000000000';
    const didDocument = await resolver.read(did);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

  it('resolver should return did-document', async () => {
    const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDocument = await resolver.read(did);
    expect(did).to.deep.equal(didDocument.id);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

  it('resolver check the current owner of did-document', async () => {
    const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const owner = await resolver.identityOwner(did);
    expect(owner).to.equal('0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947');

    const keys = new Keys();
    const newDid = `did:ewc:0x${keys.publicKey.slice(26)}`;
    const newOwner = await resolver.identityOwner(newDid);
    expect(newOwner.toLowerCase()).to.equal(`0x${keys.publicKey.slice(26)}`);
  });

  it('resolver check if delegate is present for did', async () => {
    const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const keys = new Keys();
    const newDid = `did:ewc:0x${keys.publicKey.slice(26)}`;
    const validDelegate = await resolver.validDelegate(did, DelegateTypes.verification, newDid);
    expect(validDelegate).to.be.false;
  });
});
