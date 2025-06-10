import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Chance } from 'chance';
import * as fs from 'fs';
import path from 'path';
import { DidStore } from '../src';
import { credential } from './verifiable-credential';

chai.use(chaiAsPromised);

const chance = new Chance();

const testSuite = function () {

  it('should persist multiple claims sequentially', async function () {
    for (const i of '0123456789') {
      const claim = `TEST CLAIM ${i}`;
      const cid = await this.s3Store.save(claim);
      const stored = await this.s3Store.get(cid);
      expect(stored).equal(claim);
    }
  });

  it('should persist big claim', async function () {
    const claim = fs.readFileSync('./test/big-claim.txt').toString('utf8');
    const cid = await this.s3Store.save(claim);
    const stored = await this.s3Store.get(cid);
    expect(stored.length).equal(claim.length);
    expect(stored).equal(claim);
  });

  it('should persist object', async function () {
    const content = JSON.stringify(credential);
    const cid = await this.s3Store.save(content);
    const stored = await this.s3Store.get(cid);
    expect(stored).equal(content);
  });

  it('should persist array', async function () {
    const content = JSON.stringify([1, 2, 3]);
    const cid = await this.s3Store.save(content);
    const stored = await this.s3Store.get(cid);
    expect(stored).equal(content);
  });
};

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);

  before(async function () {
    (await import('dotenv')).config({ path: path.resolve(__dirname, '.env') });
  });

  describe('[DEVELOP S3]', function () {
    before(async function () {
      this.s3Store = new DidStore(process.env.S3_BUCKET!, {
        region: process.env.AWS_REGION!,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
      });
    });

    testSuite();
  });

});
