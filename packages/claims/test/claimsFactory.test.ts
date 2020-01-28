/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { IResolver, Resolver, Operator } from '@ew-did-registry/did-resolver';
import { Networks } from '@ew-did-registry/did';
import { ClaimsFactory } from '../src/claimsFactory';
import { IClaimData } from '../src/models';

chai.use(chaiAsPromised);
const { expect } = chai;

describe('[CLAIMS PACKAGE/FACTORY CLAIMS]', function () {
  // Each participant represented by its keys
  this.timeout(0);
  const user = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const userAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const userDid = `did:${Networks.EnergyWeb}:${userAddress}`;
  const userOperator = new Operator(user);

  const issuer = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B';
  const issuerDid = `did:${Networks.Ethereum}:${issuerAddress}`
  const issuerOperator = new Operator(issuer);

  const verifier = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  });

  before(async () => {
    await userOperator.deactivate(userDid);
    await userOperator.create();

    await issuerOperator.deactivate(issuerDid);
    await issuerOperator.create();
  });

  const resolver: IResolver = new Resolver();
  const claimsUser = new ClaimsFactory(user, userOperator).createClaimsUser();
  const claimsIssuer = new ClaimsFactory(issuer, issuerOperator).createClaimsIssuer();
  const claimsVerifier = new ClaimsFactory(verifier, resolver).createClaimsVerifier();

  it('workflow of private claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const privateData: IClaimData = { secret: '123' };
    const {
      token: privateToken,
      saltedFields,
    } = await claimsUser.createPrivateClaim({}, privateData, issuerDid);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePrivateClaim(privateToken);
    // Application/User side
    const verified = await claimsUser.verifyPrivateClaim(issuedToken, saltedFields);
    // expect(verified).to.be.true;
    const claimUrl = 'http://test.service.com';
    const proofToken = await claimsUser.createProofClaim(claimUrl, saltedFields);
    // Verifier side
    const prooved = await claimsVerifier.verifyPrivateProof(proofToken, issuedToken);
  });

  it('workflow of public claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const publicData: IClaimData = { public: '123' };
    const token = await claimsUser.createPublicClaim(publicData);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePublicClaim(token);
    // Application/User side
    const verified = await claimsUser.verifyPublicClaim(issuedToken, publicData);
    // Verifier side
    const prooved = await claimsVerifier.verifyPublicProof(issuedToken);
  });
});
