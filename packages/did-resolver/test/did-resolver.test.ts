import { expect } from 'chai';

import { Resolver } from '../src';
import { IDIDDocument } from '../src/models';

describe('[RESOLVER PACKAGE]', () => {
  it('resolver should return did-document', async (done) => {
    const resolver = new Resolver();
    const did = 'did:eth:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDocument = await resolver.read(did);
    console.log(didDocument);
    expect('didDocument').to.be.a('string');
  });
});
