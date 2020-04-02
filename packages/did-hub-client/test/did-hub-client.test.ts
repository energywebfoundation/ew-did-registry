import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { runHub, shutdown } from '@ew-did-registry/did-hub';
import { HubClient } from '../src';

describe('[DID-HUB-CLIENT PACKAGE]', function () {
  this.timeout(0);
  const hubPrivKey = new Keys().privateKey;
  const hubPort = '8080';
  const hubEndpoint = `http://localhost:${hubPort}`;
  const userPrivKey = new Keys().privateKey;
  let client: HubClient;

  before('register and start hub', async () => {
    const { did: hubDid, ecPrivJwk: hubJwk } = await HubClient.register(hubPrivKey, hubEndpoint);
    const { did } = await HubClient.register(userPrivKey, hubEndpoint);
    await runHub(hubJwk, hubPort);
    client = new HubClient(did, userPrivKey, hubDid, hubEndpoint);
  });

  after('shutdown hub', () => {
    shutdown();
    process.exit(0); // can't stop test otherway probably because of not implemented @microsoft/hub-mongo-connector closing
  });

  it('fetchClaim should return claim by claim Id', async () => {
    const claim = 'Test claim';
    const claimId = await client.store(claim);
    const fetchedclaim = await client.fetchClaim(claimId);
    expect(claim).equal(fetchedclaim);
  });
});
