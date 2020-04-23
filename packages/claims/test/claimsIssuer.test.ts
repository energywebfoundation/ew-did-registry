import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { Methods } from '@ew-did-registry/did';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import { JWT } from '@ew-did-registry/jwt';
import { ClaimsFactory, IClaimsIssuer, IClaimsUser } from '../src';
import { getSettings, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.use(chaiAsPromised);
chai.should();

describe('[CLAIMS PACKAGE/ISSUER CLAIMS]', function () {
  this.timeout(0);
  const user = new Keys();
  const userAddress = user.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;

  const issuer = new Keys();
  const issuerAddress = issuer.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;

  let claimsUser: IClaimsUser;
  let claimsIssuer: IClaimsIssuer;

  before(async () => {
    const resolverSettings = await getSettings([userAddress, issuerAddress]);
    console.log(`registry: ${resolverSettings.address}`);
    const store = new DidStore(await spawnIpfsDaemon());
    const userDoc = new DIDDocumentFull(userDid, new Operator(user, resolverSettings));
    const issuerDoc = new DIDDocumentFull(issuerDid, new Operator(issuer, resolverSettings));
    await userDoc.create();
    await issuerDoc.create();

    claimsUser = new ClaimsFactory(user, userDoc, store).createClaimsUser();
    claimsIssuer = new ClaimsFactory(issuer, issuerDoc, store).createClaimsIssuer();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it('if issuer receives correct token, he must issue token signed by him', async () => {
    const token = await claimsUser.createPublicClaim({});
    return claimsIssuer.issuePublicClaim(token).should.be.fulfilled;
  });

  it('issuer must reject to issue token signed by non-owner', async () => {
    let token = await claimsUser.createPublicClaim({});
    const unauthorized = new Keys();
    const jwt = new JWT(unauthorized);
    const payload = jwt.decode(token);
    token = await jwt.sign(payload, {
      noTimestamp: true,
    });
    return claimsIssuer.issuePublicClaim(token).should.be.rejected;
  });
});
