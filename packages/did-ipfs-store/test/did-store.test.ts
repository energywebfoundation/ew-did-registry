import { expect } from 'chai';
import { DidStore } from '../src/didStore';
import { spawnIpfsDaemon, shutDownIpfsDaemon } from '../../../tests';

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);
  let store: any;

  before('start ipfs daemon', async () => {
    const api = await spawnIpfsDaemon();
    store = new DidStore(api);
  });

  after('stop the daemon', async () => {
    await shutDownIpfsDaemon();
  });

  it('get() should fetch claim by uri returned from store()', async () => {
    const claim = 'TEST CLAIM';
    const cid = await store.save(claim);
    const stored = await store.get(cid);
    expect(stored).equal(claim);
  });
});
