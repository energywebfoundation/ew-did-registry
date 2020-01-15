import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { JWT } from '@ew-did-registry/jwt';

import { Claim, VerificationClaim } from '../src';
import { IClaimData } from '../src/models';

describe('[VERIFICATION CLAIM CLASS]', () => {

  let claimData: IClaimData;
  let keys: Keys;
  let jwt: JWT;
  let keysVerifier: Keys;
  let jwtVerifier: JWT;
  let verificationClaim: VerificationClaim;

  before(async () => {
    keys = new Keys();
    jwt = new JWT(keys);
    claimData = {
      did: `did:ewc:0x${keys.publicKey}`,
      test: 'test',
    };
    const data = {
      jwt,
      keyPair: keys,
      claimData,
    };
    const publicClaim = new Claim(data);
    await publicClaim.createJWT();

    keysVerifier = new Keys();
    jwtVerifier = new JWT(keysVerifier);
    const tokenToVerify = publicClaim.token;
    const dataVerifier = {
      jwt: jwtVerifier,
      keyPair: keysVerifier,
      token: tokenToVerify,
    };

    verificationClaim = new VerificationClaim(dataVerifier);
  });

  it('verify should return true on correctly signed document', async () => {

    const verified = await verificationClaim.verify();

    expect(verified).to.be.true;
  });

  it('approve should return jwt signed by the entity', async () => {
    const approvedToken = await verificationClaim.approve();
    const approvedPayload = await jwtVerifier.verify(approvedToken, keysVerifier.publicKey);
    expect(approvedToken).to.be.a('string');
    expect(approvedPayload).to.be.eql(claimData);
  });


  it('jwt approved by verifier should be signed correctly', async () => {
    const approvedToken = await verificationClaim.approve();
    const receivedClaimData = {
      jwt,
      keyPair: keys,
      token: approvedToken,
      signerDid: `did:ewc:0x${keysVerifier.publicKey}`,
    };
    const receivedClaim = new VerificationClaim(receivedClaimData);
    const verified = await receivedClaim.verify();
    expect(approvedToken).to.be.a('string');
    expect(verified).to.be.true;
  });
});
