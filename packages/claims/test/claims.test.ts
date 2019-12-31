import { expect } from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Claims, IClaims } from '../src';
import { VerificationClaim } from '../src/public';
import { PrivateClaim } from '../src/private';
import { ProofClaim } from '../src/proof';
import { Networks } from '../../did/src/models';

/**
 * Tests are skiped until all claims are implemented
 */
describe.skip('[ABSTRACT FACTORY CLAIMS]', () => {
  let claims: IClaims;
  const keys = new Keys();

  before(() => {
    claims = new Claims(keys);
  });

  it('createPublicClaim should return instance of VerificationClaim', async () => {
    const claimData = {
      did: `did:${Networks.Ethereum}:my_id`,
      data: 'data',
    };
    const claim = claims.createPublicClaim(claimData);
    expect(claim).to.be.an.instanceOf(VerificationClaim);
  });

  it('createPrivateClaim should return instance of PrivateClaim', async () => {
    const claimData = {
      did: `did:${Networks.Ethereum}:my_id`,
      data: 'data',
    };
    const didIssuer = `did:${Networks.Ethereum}:issuer_id`;
    const claim = claims.createPrivateClaim(claimData, didIssuer);
    expect(claim).to.be.an.instanceOf(PrivateClaim);
  });

  it('createProofClaim must return instance of ProofClaim', async () => {
    const claimData = {
      did: `did:${Networks.Ethereum}:my_id`,
      data: 'data',
    };
    const hashedFields = [123, 456];
    const claim = claims.createProofClaim(claimData, hashedFields);
    expect(claim).to.be.an.instanceOf(ProofClaim);
  });

  it('generateClaimFromToken with type = ClaimType.Public must return instance of VerificationClaim', async () => {
    const claimData = {
      did: `did:${Networks.Ethereum}:my_id`,
      data: 'data',
    };
    const claim = claims.createPublicClaim(claimData);
    expect(claim).to.be.an.instanceOf(VerificationClaim);
  });
});
