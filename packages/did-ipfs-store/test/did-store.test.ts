import type { Options } from 'ipfs-http-client';
import { expect } from 'chai';
import * as fs from 'fs';
import { DidStore } from '../src/didStore';
import { shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

const testSaveGet = function () {
  it('should persist multiple claims sequentially', async function () {
    for (const i of '0123456789') {
      const claim = `TEST CLAIM ${i}`;
      const cid = await this.store.save(claim);
      const stored = await this.store.get(cid);
      expect(stored).equal(claim);
    }
  });

  it('should persist big claim', async function () {
    const claim = fs.readFileSync('./test/big-claim.txt').toString('utf8');
    const cid = await this.store.save(claim);
    const stored = await this.store.get(cid);
    expect(stored.length).equal(claim.length);
    expect(stored).equal(claim);
  });
};

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);

  describe('construct store with config object', async () => {
    before('start ipfs daemon', async function () {
      const url = await spawnIpfsDaemon();
      const opts: Options = { url };
      this.store = new DidStore(opts);
    });

    testSaveGet();

    after('stop the daemon', async () => {
      await shutDownIpfsDaemon();
    });
  });

  describe('construct store with ipfs url', async () => {
    before(async function () {
      const url = await spawnIpfsDaemon();
      this.store = new DidStore(url);
    });

    testSaveGet();

    after('stop the daemon', async () => {
      await shutDownIpfsDaemon();
    });
  });
});
