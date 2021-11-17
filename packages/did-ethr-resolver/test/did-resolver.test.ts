import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { DelegateTypes, IResolver } from '@ew-did-registry/did-resolver-interface';
import { getProvider, Resolver } from '../src';
import { deployRegistry } from '../../../tests/init-ganache';

chai.should();
chai.use(chaiAsPromised);

describe('[RESOLVER PACKAGE]', function () {
  this.timeout(60000);
  let resolver: IResolver;
  let registry: string;

  before(async () => {
    registry = await deployRegistry([]);
  });

  beforeEach(() => {
    resolver = new Resolver(getProvider(), { address: registry });
  });

  it('read document of invalid did should throw error', async () => {
    const invalidDidFirst = 'did:ethr1:0xe2e457aB987BEd9AbdEE9410FC985E46e28a394~';
    const invalidDidSecond = 'did:ethr1:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3944352749528734062daagdsgasdbv';

    return Promise.all([
      resolver.read(invalidDidFirst).should.be.rejected,
      resolver.read(invalidDidSecond).should.be.rejected,
    ]);
  });

  it('expect any valid did to have a document', async () => {
    const did = 'did:ethr:0x0000000000000000000000000000000000000000';
    const didDocument = await resolver.read(did);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

  it('expect any valid did with chain name to have a document', async () => {
    const did = 'did:ethr:ewc:0x0000000000000000000000000000000000000000';
    const didDocument = await resolver.read(did);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

  it('resolver should return did-document', async () => {
    const did = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDocument = await resolver.read(did);
    expect(did).to.deep.equal(didDocument.id);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

  it('resolver should return did-document for DID with chain name', async () => {
    const did = 'did:ethr:volta:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDocument = await resolver.read(did);
    expect(did).to.deep.equal(didDocument.id);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

  it('resolver check the current owner of did-document', async () => {
    const did = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const owner = await resolver.identityOwner(did);
    expect(owner).to.equal('0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947');

    const keys = new Keys();
    const newDid = `did:ethr:0x${keys.publicKey.slice(26)}`;
    const newOwner = await resolver.identityOwner(newDid);
    expect(newOwner.toLowerCase()).to.equal(`0x${keys.publicKey.slice(26)}`);
  });

  it('resolver check the current owner of did-document for DID with chain name', async () => {
    const did = 'did:ethr:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const owner = await resolver.identityOwner(did);
    expect(owner).to.equal('0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947');

    const keys = new Keys();
    const newDid = `did:ethr:ewc:0x${keys.publicKey.slice(26)}`;
    const newOwner = await resolver.identityOwner(newDid);
    expect(newOwner.toLowerCase()).to.equal(`0x${keys.publicKey.slice(26)}`);
  });

  it('resolver check if delegate is present for did', async () => {
    const did = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const keys = new Keys();
    const newDid = `did:ethr:0x${keys.publicKey.slice(26)}`;
    const validDelegate = await resolver.validDelegate(did, DelegateTypes.verification, newDid);
    expect(validDelegate).to.be.false;
  });

  it('resolver check if delegate is present for did with chain name', async () => {
    const did = 'did:ethr:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const keys = new Keys();
    const newDid = `did:ethr:0x${keys.publicKey.slice(26)}`;
    const validDelegate = await resolver.validDelegate(did, DelegateTypes.verification, newDid);
    expect(validDelegate).to.be.false;
  });
});
