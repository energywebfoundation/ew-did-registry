/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { expect } from 'chai';
import * as fs from 'fs';
import { DidStore } from '../src/didStore';

const projectId = '1ylataM8S7LlhfZxbJe4fBT8GMZ';
const projectSecret = '9e6be8163d19d608473b146e5abe8982'; 

const testSaveGet = function () {
  it('get() should fetch claim by uri returned from save()', async function () {
    const claim = 'TEST CLAIM';
    const cid = await this.store.save(claim);
    const stored = await this.store.get(cid);
    expect(stored).equal(claim);
  });

  xit('get() should fetch a big claim by uri returned from save()', async function () {
    const claim = fs.readFileSync('./test/big-claim.txt').toString('utf8');
    const cid = await this.store.save(claim);
    const stored = await this.store.get(cid);
    expect(stored).equal(claim);
  });
};

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);

  describe('construct store with config object', async () => {
    before('connect to IPFS API', async function () {
      // https://community.infura.io/t/how-to-add-internet-content-from-a-url-using-ipfs-http-client/5188
      const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
      const ipfsClientConfig = {
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
          headers: {
            authorization: auth
          }
      }

      this.store = new DidStore(ipfsClientConfig);
    });

    testSaveGet();
  });
});
