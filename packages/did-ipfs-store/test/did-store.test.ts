import { expect } from 'chai';
import * as fs from 'fs';
import { DidStore } from '../src/didStore';
import { shutdownIpfs, spawnIpfs } from '../../../tests';
import { ChildProcess } from 'child_process';
import { credential } from './verifiable-credential';

const testSaveGet = function () {
  it('should persist multiple claims sequentially', async function () {
    for (const i of '0123456789') {
      const claim = `TEST CLAIM ${i}`;
      const cid = await this.store.save(claim);
      expect(await this.store.isPinned(cid)).true;
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

  it('should persist object', async function () {
    const content = JSON.stringify(credential);
    const cid = await this.store.save(content);
    const stored = await this.store.get(cid);
    expect(stored).equal(content);
  });

  it('should persist array', async function () {
    const content = JSON.stringify([1, 2, 3]);
    const cid = await this.store.save(content);
    const stored = await this.store.get(cid);
    expect(stored).equal(content);
  });
};

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);

  describe('local ipfs', () => {
    let cluster: ChildProcess;

    before(async function () {
      cluster = await spawnIpfs();
      this.store = new DidStore('http://localhost:8080', {});
    });

    testSaveGet();

    after(() => {
      shutdownIpfs(cluster);
    });
  });

  xdescribe('energy web ipfs', async () => {
    before(async function () {
      const url = '';
      const Authorization = `Basic ${Buffer.from('').toString('base64')}`;
      this.store = new DidStore(url, {
        Authorization,
      });
    });

    testSaveGet();
  });
});
