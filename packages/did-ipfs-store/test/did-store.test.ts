import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Chance } from 'chance';
import Hash from 'ipfs-only-hash';
import * as fs from 'fs';
import path from 'path';
import { ContentNotFound, DidStore } from '../src';
import { shutdownIpfsCluster, spawnIpfsCluster } from '../../../tests';
import { ChildProcess } from 'child_process';
import { credential } from './verifiable-credential';

chai.use(chaiAsPromised);

const chance = new Chance();

const testSuite = function () {
  const cidPinnedInInfura = 'QmXeopgnwFcXXZ331jXybk2LQiHPXkMUHFmexckJHYxH43';

  xit('cluster content should be resolved by Infura and cluster CIDs', async function () {
    const infuraCid = cidPinnedInInfura;
    const claim = await this.gateway.get(infuraCid);
    const clusterCid = await this.cluster.save(claim);
    expect(await this.cluster.get(infuraCid)).equal(claim);
    expect(await this.cluster.get(clusterCid, 60_000)).equal(claim);
  });

  it('get() should throw error if data was not persisted', async function () {
    const cid = await Hash.of(chance.string());
    return Promise.all([
      expect(this.cluster.get(cid, 1_000)).to.be.rejectedWith(ContentNotFound),
      expect(this.gateway.get(cid, 1_000)).to.be.rejectedWith(ContentNotFound),
    ]);
  });

  it('should persist multiple claims sequentially', async function () {
    for (const i of '0123456789') {
      const claim = `TEST CLAIM ${i}`;
      const cid = await this.cluster.save(claim);
      const stored = await this.cluster.get(cid);
      expect(stored).equal(claim);
    }
  });

  it('should persist big claim', async function () {
    const claim = fs.readFileSync('./test/big-claim.txt').toString('utf8');
    const cid = await this.cluster.save(claim);
    const stored = await this.cluster.get(cid);
    expect(stored.length).equal(claim.length);
    expect(stored).equal(claim);
  });

  it('should persist object', async function () {
    const content = JSON.stringify(credential);
    const cid = await this.cluster.save(content);
    const stored = await this.cluster.get(cid);
    expect(stored).equal(content);
  });

  it('should persist array', async function () {
    const content = JSON.stringify([1, 2, 3]);
    const cid = await this.cluster.save(content);
    const stored = await this.cluster.get(cid);
    expect(stored).equal(content);
  });
};

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);

  before(async function () {
    this.gateway = new DidStore('https://ew-did-store-testing.infura-ipfs.io/');
    (await import('dotenv')).config({ path: path.resolve(__dirname, '.env') });
  });

  describe('[LOCAL CLUSTER]', function () {
    let cluster: ChildProcess;
    before(async function () {
      cluster = await spawnIpfsCluster();
      this.cluster = new DidStore('http://localhost:8080');
    });

    after(() => {
      shutdownIpfsCluster(cluster);
    });

    testSuite();
  });

  describe('[DEVELOP CLUSTER]', function () {
    before(async function () {
      const IPFS_CLUSTER_BASE_URL = process.env.IPFS_CLUSTER_BASE_URL as string;
      const IPFS_CLUSTER_USER = process.env.IPFS_CLUSTER_USER;
      const IPFS_CLUSTER_PASSWORD = process.env.IPFS_CLUSTER_PASSWORD;
      const Authorization = `Basic ${Buffer.from(
        `${IPFS_CLUSTER_USER}:${IPFS_CLUSTER_PASSWORD}`
      ).toString('base64')}`;
      this.cluster = new DidStore(IPFS_CLUSTER_BASE_URL, {
        headers: { Authorization },
      });
    });

    testSuite();
  });
});
