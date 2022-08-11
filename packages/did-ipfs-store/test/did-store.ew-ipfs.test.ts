/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { expect } from 'chai';
import * as fs from 'fs';
import { DidStore } from '../src/didStore';

const testSaveGet = function () {
  xit('get() should fetch claim by uri returned from save()', async function () {
    const claim = 'TEST CLAIM - something new'; // CID 'QmVzA7E9LpPYkxmkosXVjcpEHAJM7gpexqiMbszubx4rSJ'
    const cid = await this.store.save(claim);
    const stored = await this.store.get(cid);
    expect(stored).equal(claim);
  });

  xit('get() should fetch already pinned credential on the node', async function () {
    const claim = 'TEST CLAIM';
    const stored = await this.store.get("QmUSUswtS2iHuPYXUv97mycCuHgu4pufhvWadDva6LjSHP");
    console.log('done');
    expect(stored).equal(claim);
  });
  
  it('get() should fetch already pinned credential from a different node', async function () {
    const claim = 'eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGFpbURhdGEiOnsiZmllbGRzIjpbXSwiY2xhaW1UeXBlIjoidXNlci5yb2xlcy5lZGdlLmFwcHMuYWVtby5pYW0uZXdjIiwiY2xhaW1UeXBlVmVyc2lvbiI6MX0sImRpZCI6ImRpZDpldGhyOjB4NmQwMTc1ZkIwNzMyNTkyNTc2NkE1QjY4QTFjRGJiNDU5QzJERmExYiIsInNpZ25lciI6ImRpZDpldGhyOjB4RWY3Yzg2NkU5MzRFQkU3Njk2OEIzN2I2YzkwMTg2QTlBN0FiQ2QxYSIsImlzcyI6ImRpZDpldGhyOjB4RWY3Yzg2NkU5MzRFQkU3Njk2OEIzN2I2YzkwMTg2QTlBN0FiQ2QxYSIsInN1YiI6ImRpZDpldGhyOjB4NmQwMTc1ZkIwNzMyNTkyNTc2NkE1QjY4QTFjRGJiNDU5QzJERmExYiJ9.MHgxZThlOGYxZTM0OGI3MzdiZmFiMjM4MGI1ZTFjZjEwNDcxMmYyZDViZDgzMDRiZWYwMTY5MDY0MDcwNGQwYWNhMzJlNjE3YmY5ZWFiYTdjZjAyZGViMjYwODJmZTZhNjE4YWQwOGZkOGVkNmQ2NThhZmY0ODQwYjg0NDYwYTRjMzFj';
    const stored = await this.store.get("QmbWDCQ1kVgK1Na23PWLU5MQiZgyfq4fp7kL4m7bTXEVhC"); // pinned on Infura
    console.log('done');
    expect(stored).equal(claim);
  });
};

describe('[DID-STORE-PACKAGE]', function () {
  this.timeout(0);

  describe('construct store with config object', async () => {
    before('connect to IPFS API', async function () {
      this.store = new DidStore('<ew-ipfs-url>');
    });

    testSaveGet();
  });
});
