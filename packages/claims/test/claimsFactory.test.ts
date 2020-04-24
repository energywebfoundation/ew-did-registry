/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { Methods } from '@ew-did-registry/did';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import { ClaimsFactory, IClaimsIssuer, IClaimsUser, IClaimsVerifier, IProofData, } from '../src';
import { getSettings, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.use(chaiAsPromised);
chai.should();

describe('[CLAIMS PACKAGE/FACTORY CLAIMS]', function () {
  this.timeout(0);
  const user = new Keys();
  const userAddress = user.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;

  const issuer = new Keys();
  const issuerAddress = issuer.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;

  const verifier = new Keys();
  const verifierAddress = verifier.getAddress();
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}`;

  let claimsUser: IClaimsUser;
  let claimsIssuer: IClaimsIssuer;
  let claimsVerifier: IClaimsVerifier;

  before(async () => {
    const resolverSettings = await getSettings([userAddress, issuerAddress]);
    console.log(`registry: ${resolverSettings.address}`);
    const store = new DidStore(await spawnIpfsDaemon());
    const userDoc = new DIDDocumentFull(userDid, new Operator(user, resolverSettings));
    const issuerDoc = new DIDDocumentFull(issuerDid, new Operator(issuer, resolverSettings));
    const verifierDoc = new DIDDocumentFull(verifierDid, new Operator(issuer, resolverSettings));
    await userDoc.create();
    await issuerDoc.create();
    await verifierDoc.create();

    claimsUser = new ClaimsFactory(user, userDoc, store).createClaimsUser();
    claimsIssuer = new ClaimsFactory(issuer, issuerDoc, store).createClaimsIssuer();
    claimsVerifier = new ClaimsFactory(verifier, verifierDoc, store).createClaimsVerifier();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it('workflow of private claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const privateData = { private: '123', public: 'shhh' };
    const {
      token: privateToken,
      saltedFields,
    } = await claimsUser.createPrivateClaim(privateData, issuerDid);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePrivateClaim(privateToken);
    // Application/User side
    const claimUrl = await claimsUser.publishPrivateClaim(issuedToken, saltedFields);
    const encryptedSaltedFields: IProofData = {
      private: { value: saltedFields.private, encrypted: true },
      public: { value: saltedFields.public, encrypted: false },
    };
    const proofToken = await claimsUser.createProofClaim(claimUrl, encryptedSaltedFields);
    // Verifier side
    return claimsVerifier.verifyPrivateProof(proofToken).should.be.fulfilled;
  });

  it('workflow of public claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const publicData = { public: '123' };
    const token = await claimsUser.createPublicClaim(publicData);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePublicClaim(token);
    // Application/User side
    const claimUrl = await claimsUser.publishPublicClaim(issuedToken, publicData);
    // Verifier side
    return claimsVerifier.verifyPublicProof(claimUrl).should.be.fulfilled;
  });
});
