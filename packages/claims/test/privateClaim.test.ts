import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

import { PrivateClaim } from '../src';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ecies = require('eciesjs');

describe('[PRIVATE CLAIM CLASS]', () => {
  it('private claim data should be encrypted correctly', async () => {

    const keys = new Keys();
    const issuerKeys = new Keys();
    const jwt = new JWT(keys);
    const claimData = {
      did: `did:ewc:0x${keys.publicKey}`,
      issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
      test: 'test',
    };
    const data = {
      jwt,
      keyPair: keys,
      claimData,
    };
    const privateClaim = new PrivateClaim(data);
    const saltedFields = await privateClaim.createPrivateClaimData();
    const decryptedTestField = ecies.decrypt(`0x${issuerKeys.privateKey}`, privateClaim.claimData.test);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(decryptedTestField.toString()).to.be.eql(saltedFields.test);
  });

  it('private claim decrypts field values and hashes them to correct bit lengths', async () => {
    const keys = new Keys();
    const issuerKeys = new Keys();
    const jwt = new JWT(keys);
    const claimData = {
      did: `did:ewc:0x${keys.publicKey}`,
      issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
      test: 'test',
    };
    const data = {
      jwt,
      keyPair: keys,
      claimData,
    };
    const privateClaim = new PrivateClaim(data);
    await privateClaim.createPrivateClaimData();
    privateClaim.decryptAndHashFields(issuerKeys.privateKey);
    const hashedFields = privateClaim.claimData;
    expect(hashedFields.did).to.be.eql(`did:ewc:0x${issuerKeys.publicKey}`);
    expect(hashedFields.issuerDid.length).to.be.eql(66);
    expect(hashedFields.test.length).to.be.eql(66);
  });

  it('issuer generates and signs payload correctly', async () => {
    const keys = new Keys();
    const issuerKeys = new Keys();
    const jwt = new JWT(keys);
    const issuerJWT = new JWT(issuerKeys);
    const claimData = {
      did: `did:ewc:0x${keys.publicKey}`,
      issuerDid: `did:ewc:0x${issuerKeys.publicKey}`,
      test: 'test',
    };

    const data = {
      jwt,
      keyPair: keys,
      claimData,
    };
    const privateClaim = new PrivateClaim(data);
    const saltedFields = await privateClaim.createPrivateClaimData();
    privateClaim.decryptAndHashFields(issuerKeys.privateKey);
    const issuerSignedToken = await issuerJWT.sign(privateClaim.claimData, { algorithm: 'ES256', noTimestamp: true });
    const issuerClaimData = {
      did: `did:ewc:0x${issuerKeys.publicKey}`,
    };
    const issuerData = {
      jwt,
      keyPair: keys,
      token: issuerSignedToken,
      claimData: issuerClaimData,
    }
    const issuerReturnedPrivateClaim = new PrivateClaim(issuerData);
    issuerReturnedPrivateClaim.verify();
    const verified = issuerReturnedPrivateClaim.verifyPayload(saltedFields);
    expect(verified).to.be.true;
  });
});
