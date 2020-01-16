import { decrypt } from 'eciesjs';
import { expect } from 'chai';
import { IKeys, Keys } from '@ew-did-registry/keys';
import { IJWT, JWT } from '@ew-did-registry/jwt';
import { Resolver } from '@ew-did-registry/did-resolver';

import { PrivateClaim } from '../src';
import { IPrivateClaim, IClaimFields } from '../src/private';
// eslint-disable-next-line @typescript-eslint/no-var-requires

describe('[PRIVATE CLAIM CLASS]', () => {
  let resolver: Resolver;
  let keys: IKeys;
  let issuerKeys: IKeys;
  let jwt: IJWT;
  let claimData;
  let data;
  let privateClaim: IPrivateClaim;
  let saltedFields: IClaimFields;

  beforeEach(async () => {
    resolver = new Resolver();
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
      resolver,
      claimData,
      keyPair: keys,
    };
    privateClaim = new PrivateClaim(data);
    saltedFields = await privateClaim.createPrivateClaimData();
  });

  it('private claim data should be encrypted correctly', async () => {
    const decryptedTestField = decrypt(`0x${issuerKeys.privateKey}`, privateClaim.claimData.test as any);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    expect(decryptedTestField.toString()).to.be.eql(saltedFields.test);
  });

  it('private claim decrypts field values and hashes them to correct bit lengths', async () => {
    await privateClaim.createJWT();
    const issuerJWT = new JWT(issuerKeys);
    const issuerData = {
      resolver,
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
      resolver,
      jwt: issuerJWT,
      keyPair: issuerKeys,
      token: privateClaim.token,
    }
    const privateClaimIssuer = new PrivateClaim(issuerData);
    privateClaimIssuer.decryptAndHashFields();
    const issuerSignedToken = await issuerJWT.sign(privateClaimIssuer.claimData, { algorithm: 'ES256', noTimestamp: true });
    const issuerClaimData = {
      did: `did:ewc:0x${issuerKeys.publicKey}`,
    };
    const userData = {
      resolver,
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
