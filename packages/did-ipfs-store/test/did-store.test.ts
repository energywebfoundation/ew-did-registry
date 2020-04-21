/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { expect } from 'chai';
import * as fs from 'fs';
import { DidStore } from '../src/didStore';
import { shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

const testSaveGet = function () {
  it('get() should fetch claim by uri returned from save()', async function () {
    const claim = 'TEST CLAIM';
    const cid = await this.store.save(claim);
    const stored = await this.store.get(cid);
    expect(stored).equal(claim);
  });

  it('get() should fetch a big claim by uri returned from save()', async function () {
    const claim = fs.readFileSync('./test/big-claim.txt').toString('utf8');
    const cid = await this.store.save(claim);
    const stored = await this.store.get(cid);
    expect(stored).equal(claim);
  });
};

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);

  describe('construct store with config object', async () => {
    before('start ipfs daemon', async function () {
      const api = await spawnIpfsDaemon();
      this.store = new DidStore(api);
    });

    testSaveGet();

    after('stop the daemon', async () => {
      await shutDownIpfsDaemon();
    });
  });

  describe('construct store with node url', async () => {
    before('start ipfs daemon', async function () {
      const api = await spawnIpfsDaemon();
      this.store = new DidStore(api);
    });

    testSaveGet();

    after('stop the daemon', async () => {
      await shutDownIpfsDaemon();
    });
  });
});
