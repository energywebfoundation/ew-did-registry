import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { Methods } from '@ew-did-registry/did';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull, IDIDDocumentFull } from '@ew-did-registry/did-document';
import { DIDAttribute, PubKeyType } from '@ew-did-registry/did-resolver-interface';
import { ClaimsFactory, IClaimsIssuer, IClaimsUser } from '../src';
import { deployRegistry, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.use(chaiAsPromised);
chai.should();

const claimData = {
  name: 'John',
};

describe('[CLAIMS PACKAGE/ISSUER CLAIMS]', function () {
  this.timeout(0);
  const userKeys = new Keys();
  const userAddress = userKeys.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;

  const issuerKeys = new Keys();
  const issuerAddress = issuerKeys.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;

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
      new Operator(userKeys.privateKey, { address: registry }, 'http://localhost:8544'),
    );
    issuerDoc = new DIDDocumentFull(
      issuerDid,
      new Operator(issuerKeys.privateKey, { address: registry }, 'http://localhost:8544'),
    );
    await userDoc.create();
    await issuerDoc.create();

    claimsUser = new ClaimsFactory(userKeys, userDoc, store).createClaimsUser();
    claimsIssuer = new ClaimsFactory(issuerKeys, issuerDoc, store).createClaimsIssuer();
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
    expect(
      await claimsIssuer.issuePublicClaim(signedClaim),
    )
      .eq(
        await claimsIssuer.issuePublicClaim(unsignedClaim),
      );
  });

  it('claim issued by delegate should be verified', async () => {
    await userDoc.update(
      DIDAttribute.Authenticate,
      {
        type: PubKeyType.VerificationKey2018,
        delegate: issuerAddress,
      },
    );

    let claim = await claimsUser.createPublicClaim(claimData);

    claim = await claimsIssuer.issuePublicClaim(claim);

    const url = await claimsUser.publishPublicClaim(claim, claimData);

    return claimsUser.verify(url).should.be.fulfilled;
  });

  it('claim issued by non-delegate should not be verified', async () => {
    await userDoc.revokeDelegate(
      PubKeyType.VerificationKey2018,
      issuerDid,
    );

    let claim = await claimsUser.createPublicClaim(claimData);

    claim = await claimsIssuer.issuePublicClaim(claim);

    const url = await claimsUser.publishPublicClaim(claim, claimData);
    expect(url).empty;
  });
});
