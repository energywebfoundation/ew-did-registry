import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import {
  IClaimsIssuer, IClaimsUser, IProofData, IPublicClaim,
} from '@ew-did-registry/claims/';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDAttribute, PubKeyType } from '@ew-did-registry/did-resolver-interface';
import DIDRegistry from '../src';
import { deployRegistry, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.use(chaiAsPromised);
chai.should();

describe('[REGISTRY PACKAGE]', function () {
  this.timeout(0);
  const userKeys = new Keys();
  const userAddress = userKeys.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;

  const issuerKeys = new Keys();
  const issuerAddress = issuerKeys.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;

  const verifierKeys = new Keys();
  const verifierAddress = verifierKeys.getAddress();
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}`;

  let user: DIDRegistry;
  let userClaims: IClaimsUser;
  let issuer: DIDRegistry;
  let issuerClaims: IClaimsIssuer;
  let verifier: DIDRegistry;

  let userOperator: Operator;

  before(async () => {
    const registry = await deployRegistry([userAddress, issuerAddress, verifierAddress]);
    const ipfsApi = await spawnIpfsDaemon();
    const store = new DidStore(ipfsApi);

    userOperator = new Operator(
      userKeys.privateKey,
      { address: registry },
      'http://localhost:8544',
    );

    const issuerOperator = new Operator(
      issuerKeys.privateKey,
      { address: registry },
      'http://localhost:8544',
    );

    const verifierOperator = new Operator(
      verifierKeys.privateKey,
      { address: registry },
      'http://localhost:8544',
    );

    user = new DIDRegistry(userKeys, userDid, userOperator, store);
    issuer = new DIDRegistry(issuerKeys, issuerDid, issuerOperator, store);
    verifier = new DIDRegistry(verifierKeys, verifierDid, verifierOperator, store);  
    userClaims = user.claims.createClaimsUser();
    issuerClaims = issuer.claims.createClaimsIssuer();
    await user.document.create();
    await issuer.document.create();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it('user public claim should be issued and verified', async () => {
    const publicData = {
      name: 'Lisence',
      sn: 'abc123',
    };
    const token = await userClaims.createPublicClaim(publicData);
    // add issuer to delegates
    await userOperator.update(
      userDid,
      DIDAttribute.Authenticate,
      {
        type: PubKeyType.VerificationKey2018,
        delegate: issuerAddress,
      },
    );
    // send token to Issuer
    const issuedToken = await issuerClaims.issuePublicClaim(token);
    // send to User
    const claim: IPublicClaim = user.jwt.decode(issuedToken) as IPublicClaim;
    expect(claim.did).equal(userDid);
    expect(claim.signer).equal(issuerDid);
    expect(claim.claimData).deep.equal(publicData);
    const claimUrl = await userClaims.publishPublicClaim(issuedToken, publicData);
    expect(claimUrl).to.not.be.empty;
  });

  it('user can prove ownership of the private data', async () => {
    const privateData = {
      secret: '123',
      notSecret: 'string',
    };
    const { token, saltedFields } = await userClaims.createPrivateClaim(privateData, issuerDid);
    // User sends claim to Issuer
    const issued = await issuerClaims.issuePrivateClaim(token);
    // Issuer sends claim to User
    const claimUrl = await userClaims.publishPrivateClaim(issued, saltedFields);
    expect(claimUrl).to.not.be.empty;
    const encryptedSaltedFields: IProofData = {
      secret: { value: saltedFields.secret, encrypted: true },
      notSecret: { value: saltedFields.notSecret, encrypted: false },
    };
    const proof = await userClaims.createProofClaim(claimUrl, encryptedSaltedFields);
    const verified = verifier.claims.createClaimsVerifier().verifyPrivateProof(proof);
    return verified.should.be.fulfilled;
  });
});
