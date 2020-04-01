import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { DidStore } from '../src';

describe('[DID-STORE PACKAGE]', function () {
  this.timeout(0);
  const hubKeys = new Keys({
    privateKey: 'a953284e480107de25b915498cb56bfa046c870f56df58021ba1b721021010cc',
    publicKey: '02d193753f631788dc36a940ea021ccf9c5a218f992834ccafac304aaafbc29711',
  });
  const keys = new Keys();
  const hubDid = 'did:test:cd4e18c0-94c9-4b77-977d-542093fb8e98';
  const hubEndpoint = 'http://localhost:8080';
  let did: string;
  let store: DidStore;

  before('registration', async () => {
    did = await DidStore.register(keys.privateKey, 'http://localhost:8080');
    store = new DidStore(did, keys.privateKey, hubDid, hubEndpoint);
  });

  it('fetchClaim should return claim by claim Id', async () => {
    const claim = 'Test claim';
    const claimId = await store.store(claim);
    // console.log('>>> store response:', claimId);
    // const objectIds = await store.getObjectIds();
    // console.log('>>> object ids:', objectIds);
    const fetchedclaim = await store.fetchClaim(claimId);
    expect(claim).equal(fetchedclaim);
    // console.log('>>> claim:', claim);
  });
});
