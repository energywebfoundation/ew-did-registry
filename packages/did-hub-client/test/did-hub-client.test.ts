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
  const keys = new Keys();
  let client: HubClient;

  before('registration', async () => {
    const { did: hubDid, ecPrivJwk: hubJwk } = await HubClient.register(hubPrivKey, hubEndpoint);
    const { did } = await HubClient.register(keys.privateKey, hubEndpoint);
    await runHub(hubJwk, hubPort);
    client = new HubClient(did, keys.privateKey, hubDid, hubEndpoint);
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
