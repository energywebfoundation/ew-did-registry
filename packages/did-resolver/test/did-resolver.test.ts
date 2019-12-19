import { expect } from 'chai';

import { Resolver } from '../src';

describe('[RESOLVER PACKAGE]', function() {
  this.timeout(60000);

  it('resolver should return did-document', async () => {
    const resolver = new Resolver();
    const did = 'did:eth:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDocument = await resolver.read(did);
    expect(didDocument).include.keys('@context', 'id', 'publicKey', 'authentication', 'service');
  });
});
