import { expect } from 'chai';
import { DidStore } from '../src/didStore';

describe('[DID-STORE-PACKAGE]', () => {
  const ipfsApi = '/ip4/127.0.0.1/tcp/5001';
  const store = new DidStore(ipfsApi);

  it('get() should fetch claim by uri returned from store()', async () => {
    const claim = 'TEST CLAIM';
    const cid = await store.store(claim);
    const stored = await store.get(cid);
    expect(stored).equal(claim);
  });
});
