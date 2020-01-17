/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { IResolver, Resolver } from '@ew-did-registry/did-resolver';
import { Networks } from '@ew-did-registry/did';
import { ClaimsFactory } from '../src/claimsFactory';
import { IClaimData } from '../src/models';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('[CLAIMS PACKAGE/FACTORY CLAIMS]', () => {
  // Each participant represented by its keys
  const user = new Keys();
  const issuer = new Keys();
  const issuerDid = `did:${Networks.Ethereum}:0x${issuer.publicKey}`;
  const verifier = new Keys();
  const resolver: IResolver = new Resolver();
  const claimsUser = new ClaimsFactory(user, resolver).createClaimsUser();
  const claimsIssuer = new ClaimsFactory(issuer, resolver).createClaimsIssuer();
  const claimsVerifier = new ClaimsFactory(verifier, resolver).createClaimsVerifier();

  it('workflow of private claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const claimData: IClaimData = { secret: '123' };
    const { token: privateToken, saltedFields } = await claimsUser.createPrivateClaim(claimData, issuerDid);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePrivateClaim(privateToken);
    // Application/User side
    const verified = await claimsUser.verifyPrivateClaim(issuedToken, saltedFields);
    expect(verified).to.be.true;
    const claimUrl = 'http://test.service.com';
    const proofToken = await claimsUser.createProofClaim(claimUrl, saltedFields);
    // Verifier side
    const prooved = claimsVerifier.verifyPrivateProof(proofToken, issuedToken);
    expect(prooved).to.be.true;
  });

  it('workflow of public claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const claimData: IClaimData = { public: '123' };
    const token = await claimsUser.createPublicClaim(claimData);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePublicClaim(token);
    // Application/User side
    const verified = await claimsUser.verifyPublicClaim(issuedToken);
    expect(verified).to.be.true;
    // Verifier side
    const prooved = await claimsVerifier.verifyPublicProof(issuedToken);
    expect(prooved).to.be.true;
  });
});
