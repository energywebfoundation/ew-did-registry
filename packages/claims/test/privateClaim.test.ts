import { expect } from 'chai';
import { IKeys, Keys } from '@ew-did-registry/keys';
import { IJWT, JWT } from '@ew-did-registry/jwt';

import { PrivateClaim } from '../src';
import { IPrivateClaim } from '../src/private';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ecies = require('eciesjs');

describe('[PRIVATE CLAIM CLASS]', () => {

  let keys: IKeys;
  let issuerKeys: IKeys;
  let jwt: IJWT;
  let claimData;
  let data;
  let privateClaim: IPrivateClaim;
  let saltedFields: { [key: string]: string };

  beforeEach(async () => {
    keys = new Keys();
    issuerKeys = new Keys();
    jwt = new JWT(keys);
    claimData = {
      did: `did:ewc:0x${keys.publicKey}`,
      issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
      test: 'test',
    };
    data = {
      jwt,
      keyPair: keys,
      claimData,
    };
    privateClaim = new PrivateClaim(data);
    saltedFields = await privateClaim.createPrivateClaimData();
  });

  it('private claim data should be encrypted correctly', async () => {
    const decryptedTestField = ecies.decrypt(`0x${issuerKeys.privateKey}`, privateClaim.claimData.test);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(decryptedTestField.toString()).to.be.eql(saltedFields.test);
  });

  it('private claim decrypts field values and hashes them to correct bit lengths', async () => {
    await privateClaim.createJWT();
    const issuerJWT = new JWT(issuerKeys);
    const issuerData = {
      jwt: issuerJWT,
      keyPair: issuerKeys,
      token: privateClaim.token,
    }
    const privateClaimIssuer = new PrivateClaim(issuerData);
    privateClaimIssuer.decryptAndHashFields();
    const hashedFields = privateClaimIssuer.claimData;
    expect(hashedFields.did).to.be.eql(`did:ewc:0x${keys.publicKey}`);
    expect(hashedFields.issuerDid.length).to.be.eql(66);
    expect(hashedFields.test.length).to.be.eql(66);
  });

  it('issuer generates and signs payload correctly', async () => {

    await privateClaim.createJWT();
    const issuerJWT = new JWT(issuerKeys);
    const issuerData = {
      jwt: issuerJWT,
      keyPair: issuerKeys,
      token: privateClaim.token,
    }
    const privateClaimIssuer = new PrivateClaim(issuerData);
    privateClaimIssuer.decryptAndHashFields();
    const issuerSignedToken = await issuerJWT.sign(privateClaim.claimData, { algorithm: 'ES256', noTimestamp: true });
    const issuerClaimData = {
      did: `did:ewc:0x${issuerKeys.publicKey}`,
    };
    const userData = {
      jwt,
      keyPair: keys,
      token: issuerSignedToken,
      claimData: issuerClaimData,
    };
    const issuerReturnedPrivateClaim = new PrivateClaim(userData);
    const verified = issuerReturnedPrivateClaim.verifyPayload(saltedFields);
    expect(verified).to.be.true;
  });
});
