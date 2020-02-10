/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import {
  IResolver,
  Resolver,
  Operator,
  IOperator,
  IResolverSettings,
} from '@ew-did-registry/did-resolver';
import { Networks } from '@ew-did-registry/did';
import { ClaimsFactory } from '../src/claimsFactory';
import { IProofData } from '../src/models';
import { IClaimsIssuer, IClaimsUser, IClaimsVerifier } from '../src';
import { getSettings } from '../../../tests/init-ganache';

chai.use(chaiAsPromised);

describe('[CLAIMS PACKAGE/FACTORY CLAIMS]', function () {
  // Each participant represented by its keys
  this.timeout(0);
  const user = new Keys({
    privateKey: '73b2e47a3a9b60cf91eae4fa4a5c2ce1c8ea019e8994b76cdceca6c2a03e957e',
    publicKey: '02cb7cd2b5eee35d55e1d5202862d4341fdd28f9b9739f370a254e3cabc368d9bd',
  });
  const userAddress = '0x5AAab994B9103F427bEDedc2173f33e347a3DeE2';
  const userDid = `did:${Networks.EnergyWeb}:${userAddress}`;
  let userOperator: IOperator;

  const issuer = new Keys({
    privateKey: '7809091ad3646a9505b7ae5597f9f344e43df9e4d4fb12ecc48bda87c7bbda2c',
    publicKey: '0315a744bd5583193d39f2b158abec9c4fca8871e83e83b21bf9fc7bd07c842a61',
  });
  const issuerAddress = '0x116b43b21F082e941c78486809AE0010bb60DFA4';
  const issuerDid = `did:${Networks.Ethereum}:${issuerAddress}`;
  let issuerOperator: IOperator;

  const verifier = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  });

  let claimsUser: IClaimsUser;
  let claimsIssuer: IClaimsIssuer;
  let claimsVerifier: IClaimsVerifier;

  let resolver: IResolver;

  before(async () => {
    const resolverSettings: IResolverSettings = await getSettings([userAddress, issuerAddress]);
    console.log(`registry: ${resolverSettings.address}`);

    resolver = new Resolver(resolverSettings);
    userOperator = new Operator(user, resolverSettings);
    issuerOperator = new Operator(issuer, resolverSettings);

    await userOperator.deactivate(userDid);
    await userOperator.create();

    await issuerOperator.deactivate(issuerDid);
    await issuerOperator.create();

    claimsUser = new ClaimsFactory(user, userOperator).createClaimsUser();
    claimsIssuer = new ClaimsFactory(issuer, issuerOperator).createClaimsIssuer();
    claimsVerifier = new ClaimsFactory(verifier, resolver).createClaimsVerifier();
  });

  it('workflow of private claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const privateData = { secret: '123', anotherSecret: 'shhh' };
    const {
      token: privateToken,
      saltedFields,
    } = await claimsUser.createPrivateClaim(privateData, issuerDid);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePrivateClaim(privateToken);
    // Application/User side
    await claimsUser.verifyPrivateClaim(issuedToken, saltedFields);
    // expect(verified).to.be.true;
    const claimUrl = 'http://test.service.com';
    const encryptedSaltedFields: IProofData = {};
    let counter = 0;
    Object.entries(saltedFields).forEach(([key, value]) => {
      if (counter % 2 === 0) {
        encryptedSaltedFields[key] = {
          value,
          encrypted: true,
        };
      } else {
        encryptedSaltedFields[key] = {
          value,
          encrypted: false,
        };
      }
      // eslint-disable-next-line no-plusplus
      counter++;
    });
    const proofToken = await claimsUser.createProofClaim(claimUrl, encryptedSaltedFields);
    // Verifier side
    await claimsVerifier.verifyPrivateProof(proofToken, issuedToken);
  });

  it('workflow of public claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const publicData = { public: '123' };
    const token = await claimsUser.createPublicClaim(publicData);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePublicClaim(token);
    // Application/User side
    await claimsUser.verifyPublicClaim(issuedToken, publicData);
    // Verifier side
    await claimsVerifier.verifyPublicProof(issuedToken);
  });
});
