import { decrypt } from 'eciesjs';
import chai from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import { Operator } from '@ew-did-registry/did-ethr-resolver';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import {
  ClaimsUser, IClaimsUser, IPrivateClaim, IProofClaim,
} from '../src';
import { getSettings, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.should();

describe('[CLAIMS PACKAGE/USER CLAIMS]', function () {
  this.timeout(0);
  const user = new Keys();
  const userAddress = user.getAddress();
  const userDdid = `did:${Methods.Erc1056}:${userAddress}`;
  const issuer = new Keys();
  const issuerAddress = issuer.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;

  let userClaims: IClaimsUser;

  before(async () => {
    const resolverSettings = await getSettings([issuerAddress, userAddress]);
    console.log(`registry: ${resolverSettings.address}`);

    const store = new DidStore(await spawnIpfsDaemon());
    const userDoc = new DIDDocumentFull(userDdid, new Operator(user, resolverSettings));
    userClaims = new ClaimsUser(user, userDoc, store);

    const issuerDoc = new DIDDocumentFull(issuerDid, new Operator(issuer, resolverSettings));

    await userDoc.create();
    await issuerDoc.create();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it('createPublicClaim should create token with claim data', async () => {
    const publicData = {
      name: 'John',
    };
    const token = await userClaims.createPublicClaim(publicData);
    (await userClaims.verifyPublicClaim(token, publicData)).should.be.true;
    const claim = await userClaims.jwt.verify(
      token, userClaims.keys.publicKey, { noTimestamp: true },
    );
    claim.should.deep.include({
      did: userDdid,
      signer: userDdid,
      claimData: publicData,
    });
  });

  it('creates and verifies 100 claims', async () => {
    const claims: { token: string; data: object }[] = [];
    for (let i = 0; i < 100; i++) {
      const data = { name: 'John', lastName: 'Doe', index: i };
      // eslint-disable-next-line no-await-in-loop
      claims.push({ token: (await userClaims.createPublicClaim(data)), data });
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const { token, data } of claims) {
      // eslint-disable-next-line no-await-in-loop
      (await userClaims.verifyPublicClaim(token, data)).should.be.true;
    }
  });

  it('createPrivateToken should create token with data decryptable by issuer', async () => {
    const secret = '123';
    const { token, saltedFields } = await userClaims.createPrivateClaim({ secret }, issuerDid);
    const claim = userClaims.jwt.decode(token, { noTimestamp: true }) as IPrivateClaim;
    const decrypted = decrypt(
      issuer.privateKey,
      Buffer.from(claim.claimData.secret, 'hex'),
    );
    decrypted.toString().should.equal(saltedFields.secret);
  });

  it('createProofClaim should return well formed proof claim', async () => {
    const claimUrl = 'http://test.com';
    const proofData = { secret: { value: '123abc', encrypted: true } };
    const token = await userClaims.createProofClaim(claimUrl, proofData);
    const claim = await userClaims.jwt.verify(token, userClaims.keys.publicKey, { noTimestamp: true }) as IProofClaim;
    claim.should.include({ did: userDdid, signer: userDdid, claimUrl });
    claim.should.have.nested.property('proofData.secret.value.h').which.instanceOf(Array);
    claim.should.have.nested.property('proofData.secret.value.s').which.instanceOf(Array);
  });
});
