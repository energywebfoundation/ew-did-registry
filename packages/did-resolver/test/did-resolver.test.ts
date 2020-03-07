import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';

import { Keys } from '@ew-did-registry/keys';
import {
  Resolver,
  IResolver,
  DelegateTypes,
  Operator, IResolverSettings,
} from '../src';
import { getSettings } from '../../../tests/init-ganache';

chai.should();
chai.use(chaiAsPromised);

describe('[RESOLVER PACKAGE]', function () {
  this.timeout(60000);
  let resolver: IResolver;
  const keys = new Keys({
    privateKey: '49d484400c2b86a89d54f26424c8cbd66a477a6310d7d4a3ab9cbd89633b902c',
    publicKey: '023d6e5b341099c21cd4093ebe3228dc80a2785479b8211d20399698f61ee264d0',
  });
  let operator: Operator;
  let operatorSetting: IResolverSettings;

  before(async () => {
    operatorSetting = await getSettings([]);
    operator = new Operator(keys, operatorSetting);
  });

  beforeEach(() => {
    resolver = new Resolver(operatorSetting);
  });

  it('invalid did should throw an error', async () => {
    const invalidDidFirst = 'did:ewc1:0xe2e457aB987BEd9AbdEE9410FC985E46e28a394~';
    resolver.read(invalidDidFirst).should.be.rejected;

    const invalidDidSecond = 'did:ewc1:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3944352749528734062daagdsgasdbv';
    resolver.read(invalidDidSecond).should.be.rejected;
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
