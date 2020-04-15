import { expect } from 'chai';
import * as fs from 'fs';
import { DidStore } from '../src/didStore';
import { shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);
  let store: any;

  before('start ipfs daemon', async () => {
    const api = await spawnIpfsDaemon();
    store = new DidStore(api);
    store = new DidStore({ host: 'localhost' });
  });

  after('stop the daemon', async () => {
    await shutDownIpfsDaemon();
  });

  it('get() should fetch claim by uri returned from save()', async () => {
    const claim = 'TEST CLAIM';
    const cid = await store.save(claim);
    const stored = await store.get(cid);
    expect(stored).equal(claim);
  });

  it('get() should fetch a big claim by uri returned from save()', async () => {
    const claim = fs.readFileSync('./test/big-claim.txt').toString('utf8');
    const cid = await store.save(claim);
    const stored = await store.get(cid);
    expect(stored).equal(claim);
  });
});
