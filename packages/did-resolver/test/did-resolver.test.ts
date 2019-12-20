import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';


import { Resolver, IResolver } from '../src';

describe('[RESOLVER PACKAGE]', function() {
  this.timeout(60000);
  let resolver: IResolver;

  before(() => {
    chai.should();
    chai.use(chaiAsPromised);
  });

  beforeEach(() => {
    resolver = new Resolver();
  });

  it('invalid did should throw an error', async () => {
    const invalidDid = 'did:ewc1:0xe2e457aB987BEd9AbdEE9410FC985E46e28a394~';
    resolver.read(invalidDid).catch((error) => {
      expect(error.toString()).to.equal('Error: Invalid did provided');
    });
  });

  it('expect any valid did to have a document', async() => {
    const did = 'did:ewc:0x0000000000000000000000000000000000000000';
    const didDocument = await resolver.read(did);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  })

  it('resolver should return did-document', async () => {
    const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDocument = await resolver.read(did);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });

});
