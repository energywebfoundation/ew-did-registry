import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { EwSigner, Operator } from '@ew-did-registry/did-ethr-resolver';
import { Methods } from '@ew-did-registry/did';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import {
  DIDDocumentFull,
  IDIDDocumentFull,
} from '@ew-did-registry/did-document';
import {
  DIDAttribute,
  PubKeyType,
  ProviderTypes,
  ProviderSettings,
} from '@ew-did-registry/did-resolver-interface';
import {
  ClaimsFactory,
  IClaimsIssuer,
  IClaimsUser,
  IPublicClaim,
} from '../src';
import { deployRegistry, shutdownIpfs, spawnIpfs } from '../../../tests';
import {
  CredentialStatusPurpose,
  StatusListEntryType,
} from '@ew-did-registry/credentials-interface';
import * as jwt from 'jsonwebtoken';
import { ChildProcess } from 'child_process';

chai.use(chaiAsPromised);
chai.should();

const claimData = {
  name: 'John',
};
const providerSettings: ProviderSettings = {
  type: ProviderTypes.HTTP,
};

describe('[CLAIMS PACKAGE/ISSUER CLAIMS]', function () {
  this.timeout(0);
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

  let userDoc: IDIDDocumentFull;
  let issuerDoc: IDIDDocumentFull;

  let claimsUser: IClaimsUser;
  let claimsIssuer: IClaimsIssuer;

  let cluster: ChildProcess;

  before(async () => {
    const registry = await deployRegistry([userAddress, issuerAddress]);
    console.log(`registry: ${registry}`);
    cluster = await spawnIpfs();
    const store = new DidStore('http://localhost:8080');
    userDoc = new DIDDocumentFull(
      userDid,
      new Operator(user, { address: registry })
    );
    issuerDoc = new DIDDocumentFull(
      issuerDid,
      new Operator(issuer, { address: registry })
    );
    await userDoc.create();
    await issuerDoc.create();

    claimsUser = new ClaimsFactory(
      userKeys,
      userDoc,
      store,
      providerSettings
    ).createClaimsUser();

    claimsIssuer = new ClaimsFactory(
      issuerKeys,
      issuerDoc,
      store,
      providerSettings
    ).createClaimsIssuer();
  });

  after(async () => {
    shutdownIpfs(cluster);
  });

  it('both signed and unsigned claims can be issued', async () => {
    const signedClaim = await claimsUser.createPublicClaim({ name: 'John' });
    const unsignedClaim = {
      claimData: { name: 'John' },
      did: claimsUser.did,
      signer: claimsUser.did,
    };
    expect(await claimsIssuer.issuePublicClaim(signedClaim)).eq(
      await claimsIssuer.issuePublicClaim(unsignedClaim)
    );
  });

  it('should add expiration timestamp to issued claim', async () => {
    const expirationTimestamp = Date.now() + 1000;
    const unsignedClaim = {
      claimData: { name: 'John' },
      did: claimsUser.did,
      signer: claimsUser.did,
      exp: expirationTimestamp,
    };
    const issuedToken = await claimsIssuer.issuePublicClaim(unsignedClaim);
    expect(issuedToken).to.exist;

    const decodedPayload = jwt.decode(issuedToken) as IPublicClaim;

    expect(decodedPayload.exp).to.eq(expirationTimestamp);
  });

  it('claim issued by delegate should be verified', async () => {
    await userDoc.update(DIDAttribute.Authenticate, {
      type: PubKeyType.VerificationKey2018,
      delegate: issuerAddress,
    });

    let claim = await claimsUser.createPublicClaim(claimData);

    claim = await claimsIssuer.issuePublicClaim(claim);

    const url = await claimsUser.publishPublicClaim(claim, claimData);

    return claimsUser.verify(url).should.be.fulfilled;
  });
  it('claim should tokenize credentialStatus if it is present', async () => {
    const claim = {
      claimData: { name: 'John' },
      did: claimsUser.did,
      signer: claimsUser.did,
      credentialStatus: {
        id: 'https://energyweb.org/credential/0xc17c1273e0a0c8f3893d2a6a6f09929493b9ddd88ba0f69134c999a62dc3ba0f#list',
        type: StatusListEntryType.Entry2021,
        statusListIndex: '1',
        statusPurpose: CredentialStatusPurpose.REVOCATION,
        statusListCredential:
          'https://identitycache.org/v1/status-list/urn:uuid:feab7fe0-c9ed-4c83-9f53-d16b882b0c75',
      },
    };
    const token = await claimsIssuer.issuePublicClaim(claim);
    const resolvedToken = claimsIssuer.jwt.decode(token);
    expect(resolvedToken).to.have.own.property('credentialStatus');
  });
  it('tokenized claim should not have credentialStatus key if it is not present on claim', async () => {
    const claim = {
      claimData: { name: 'John' },
      did: claimsUser.did,
      signer: claimsUser.did,
    };
    const token = await claimsIssuer.issuePublicClaim(claim);
    const resolvedToken = claimsIssuer.jwt.decode(token);
    expect(resolvedToken).to.not.have.own.property('credentialStatus');
  });
});
