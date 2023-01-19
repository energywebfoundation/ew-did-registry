import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { EwSigner, Operator } from '@ew-did-registry/did-ethr-resolver';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import {
  IClaimsIssuer,
  IClaimsUser,
  IProofData,
  IPublicClaim,
} from '@ew-did-registry/claims/';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import {
  DIDAttribute,
  PubKeyType,
  ProviderTypes,
  ProviderSettings,
} from '@ew-did-registry/did-resolver-interface';
import { ChildProcess } from 'child_process';
import DIDRegistry from '../src';
import {
  deployRegistry,
  shutdownIpfsCluster,
  spawnIpfsCluster,
} from '../../../tests';

chai.use(chaiAsPromised);
chai.should();

describe('[REGISTRY PACKAGE]', function () {
  this.timeout(0);

  const providerSettings: ProviderSettings = {
    type: ProviderTypes.HTTP,
  };

  const userKeys = new Keys();
  const userAddress = userKeys.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;
  const user = EwSigner.fromPrivateKey(userKeys.privateKey, providerSettings);

  const issuerKeys = new Keys();
  const issuerAddress = issuerKeys.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;
  const issuer = EwSigner.fromPrivateKey(
    issuerKeys.privateKey,
    providerSettings
  );

  const verifierKeys = new Keys();
  const verifierAddress = verifierKeys.getAddress();
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}`;
  const verifier = EwSigner.fromPrivateKey(
    verifierKeys.privateKey,
    providerSettings
  );

  let userReg: DIDRegistry;
  let userClaims: IClaimsUser;
  let issuerReg: DIDRegistry;
  let issuerClaims: IClaimsIssuer;
  let verifierReg: DIDRegistry;

  let userOperator: Operator;
  let cluster: ChildProcess;

  before(async () => {
    const registry = await deployRegistry([
      userAddress,
      issuerAddress,
      verifierAddress,
    ]);
    cluster = await spawnIpfsCluster();
    const store: DidStore = new DidStore('http://localhost:8080');

    userOperator = new Operator(user, { address: registry });

    const issuerOperator = new Operator(issuer, { address: registry });

    const verifierOperator = new Operator(verifier, { address: registry });

    userReg = new DIDRegistry(
      userKeys,
      userDid,
      userOperator,
      store,
      providerSettings
    );

    issuerReg = new DIDRegistry(
      issuerKeys,
      issuerDid,
      issuerOperator,
      store,
      providerSettings
    );

    verifierReg = new DIDRegistry(
      verifierKeys,
      verifierDid,
      verifierOperator,
      store,
      providerSettings
    );
    userClaims = userReg.claims.createClaimsUser();
    issuerClaims = issuerReg.claims.createClaimsIssuer();
    await userReg.document.create();
    await issuerReg.document.create();
  });

  after(async () => {
    shutdownIpfsCluster(cluster);
  });

  it('user public claim should be issued and verified', async () => {
    const publicData = {
      name: 'Lisence',
      sn: 'abc123',
    };
    const token = await userClaims.createPublicClaim(publicData);
    // add issuer to delegates
    await userOperator.update(userDid, DIDAttribute.Authenticate, {
      type: PubKeyType.VerificationKey2018,
      delegate: issuerAddress,
    });
    // send token to Issuer
    const issuedToken = await issuerClaims.issuePublicClaim(token);
    // send to User
    const claim: IPublicClaim = userReg.jwt.decode(issuedToken) as IPublicClaim;
    expect(claim.did).equal(userDid);
    expect(claim.signer).equal(issuerDid);
    expect(claim.claimData).deep.equal(publicData);
    const claimUrl = await userClaims.publishPublicClaim(
      issuedToken,
      publicData
    );
    expect(claimUrl).to.not.be.empty;
  });

  it('user can prove ownership of the private data', async () => {
    const privateData = {
      secret: '123',
      notSecret: 'string',
    };
    const { token, saltedFields } = await userClaims.createPrivateClaim(
      privateData,
      issuerDid
    );
    // User sends claim to Issuer
    const issued = await issuerClaims.issuePrivateClaim(token);
    // Issuer sends claim to User
    const claimUrl = await userClaims.publishPrivateClaim(issued, saltedFields);
    expect(claimUrl).to.not.be.empty;
    const encryptedSaltedFields: IProofData = {
      secret: { value: saltedFields.secret, encrypted: true },
      notSecret: { value: saltedFields.notSecret, encrypted: false },
    };
    const proof = await userClaims.createProofClaim(
      claimUrl,
      encryptedSaltedFields
    );
    const verified = verifierReg.claims
      .createClaimsVerifier()
      .verifyPrivateProof(proof);
    return verified.should.be.fulfilled;
  });
});
