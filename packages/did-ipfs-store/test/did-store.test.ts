import { expect } from 'chai';
import Ctl from 'ipfsd-ctl';
import path from 'path';
import ipfsHttpModule from 'ipfs-http-client';
import { DidStore } from '../src/didStore';

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);
  let ipfsd: any;
  let store: any;

  before('start ipfs daemon', async () => {
    const ipfsBin = path.resolve(__dirname, '../', 'node_modules/.bin', 'jsipfs');
    ipfsd = await Ctl.createController({
      type: 'js', disposable: true, test: true, ipfsBin, ipfsHttpModule,
    });
    const api = ipfsd.apiAddr;
    store = new DidStore(api);
  });

  after('stop the daemon', async () => {
    await ipfsd.stop();
  });

  it('get() should fetch claim by uri returned from store()', async () => {
    const claim = 'TEST CLAIM';
    const cid = await store.save(claim);
    const stored = await store.get(cid);
    expect(stored).equal(claim);
  });
});
