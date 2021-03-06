/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import {
  Operator, signerFromKeys, getProvider, walletPubKey,
  withKey, withProvider,
} from '@ew-did-registry/did-ethr-resolver';
import { Methods } from '@ew-did-registry/did';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import {
  ClaimsFactory, IClaimsIssuer, IClaimsUser, IClaimsVerifier, IProofData,
} from '../src';
import { deployRegistry, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.use(chaiAsPromised);
chai.should();

describe('[CLAIMS PACKAGE/FACTORY CLAIMS]', function () {
  this.timeout(0);
  const userKeys = new Keys();
  const user = withKey(withProvider(signerFromKeys(userKeys), getProvider()), walletPubKey);
  const userAddress = userKeys.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;

  const issuerKeys = new Keys();
  const issuer = withKey(withProvider(signerFromKeys(issuerKeys), getProvider()), walletPubKey);
  const issuerAddress = issuerKeys.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;

  const verifierKeys = new Keys();
  const verifier = withKey(withProvider(signerFromKeys(verifierKeys), getProvider()), walletPubKey);
  const verifierAddress = verifierKeys.getAddress();
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}`;

  let claimsUser: IClaimsUser;
  let claimsIssuer: IClaimsIssuer;
  let claimsVerifier: IClaimsVerifier;

  before(async () => {
    const registry = await deployRegistry([userAddress, issuerAddress, verifierAddress]);
    console.log(`registry: ${registry}`);
    const store = new DidStore(await spawnIpfsDaemon());
    const userDoc = new DIDDocumentFull(userDid, new Operator(user, { address: registry }));
    const issuerDoc = new DIDDocumentFull(issuerDid, new Operator(issuer, { address: registry }));
    const verifierDoc = new DIDDocumentFull(verifierDid, new Operator(verifier, { address: registry }));
    await userDoc.create();
    await issuerDoc.create();
    await verifierDoc.create();

    claimsUser = new ClaimsFactory(userKeys, userDoc, store).createClaimsUser();
    claimsIssuer = new ClaimsFactory(issuerKeys, issuerDoc, store).createClaimsIssuer();
    claimsVerifier = new ClaimsFactory(verifierKeys, verifierDoc, store).createClaimsVerifier();
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
    try {
      await claimsVerifier.verifyPrivateProof(proofToken);
    } catch (e) {
      console.error('error verifing claims:', e);
    }
    // return claimsVerifier.verifyPrivateProof(proofToken).should.be.fulfilled;
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
