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
import { ClaimsFactory, IClaimsIssuer, IClaimsUser } from '../src';
import {
  deployRegistry,
  shutDownIpfsDaemon,
  spawnIpfsDaemon,
} from '../../../tests';

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

  before(async () => {
    const registry = await deployRegistry([userAddress, issuerAddress]);
    console.log(`registry: ${registry}`);
    const store = new DidStore(await spawnIpfsDaemon());
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
    await shutDownIpfsDaemon();
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
    const signedClaim = await claimsUser.createPublicClaim({ name: 'John' });
    const expirationTimestamp = Date.now() + 1000;
    const issuedToken = await claimsIssuer.issuePublicClaim(
      signedClaim,
      expirationTimestamp
    );
    expect(issuedToken).to.exist;

    const { 1: payload } = issuedToken.split('.');
    const decodedPayload = JSON.parse(
      Buffer.from(payload, 'base64').toString('utf8')
    );

    expect(decodedPayload.exp).to.eq(Math.trunc(expirationTimestamp / 1000));
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
      credentialStatus:  {
        id: 'https://energyweb.org/credential/0xc17c1273e0a0c8f3893d2a6a6f09929493b9ddd88ba0f69134c999a62dc3ba0f#list',
        type: 'StatusList2021Entry',
        statusListIndex: '1',
        statusPurpose: 'revocation',
        statusListCredential: 'https://identitycache.org/v1/status-list/urn:uuid:feab7fe0-c9ed-4c83-9f53-d16b882b0c75'
      }
    };
    const token = await claimsIssuer.issuePublicClaim(claim);
    console.log(token, "THE ISSUED TOKEN")
    const resolvedToken = claimsIssuer.jwt.decode(token);
    console.log(resolvedToken, "THE RESOLVED TOKEN")
    expect(resolvedToken).to.have.own.property('credentialStatus');
  });
});
