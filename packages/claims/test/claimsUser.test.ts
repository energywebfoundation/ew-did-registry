import chai from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Resolver, Operator } from '@ew-did-registry/did-resolver';
import { Networks } from '@ew-did-registry/did';
import { decrypt } from 'eciesjs';
import { ClaimsUser } from '../src/claimsUser';
import { IClaimData, IClaim } from '../src/models';

chai.should();

describe('[CLAIMS PACKAGE/USER CLAIMS]', function () {
  this.timeout(0);
  const user = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const userAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const userDdid = `did:${Networks.Ethereum}:${userAddress}`;
  const userOperator = new Operator(user);
  const issuer = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B';
  const issuerDid = `did:${Networks.Ethereum}:${issuerAddress}`;
  const issuerOperator = new Operator(issuer);
  const resolver = new Resolver();
  const userClaims = new ClaimsUser(user, resolver);

  before(async () => {
    await userOperator.create();
    await issuerOperator.create();
  });

  it('createPublicClaim should create token with claim data', async () => {
    const claimData: IClaimData = {
      name: 'John',
    };
    const token = await userClaims.createPublicClaim(claimData);
    const claim = await userClaims.jwt.verify(token, userClaims.keys.publicKey, { algorithm: 'ES256', noTimestamp: true });
    claim.should.deep.equal({
      did: userDdid,
      signer: userDdid,
      claimData,
    });
  });

  it('createPrivateToken should create token with data decryptable by issuer', async () => {
    const secret = '123';
    const { token, saltedFields } = await userClaims.createPrivateClaim({ secret }, issuerDid);
    const claim: IClaim = await userClaims.jwt.verify(token, userClaims.keys.publicKey, { algorithm: 'ES256', noTimestamp: true }) as IClaim;
    const decryped = decrypt(
      issuer.privateKey,
      Buffer.from((claim.claimData.secret as { data: Buffer }).data),
    );
    decryped.toString().should.equal(saltedFields.secret);
  });

  it('createProofClaim should return well formed proof claim', async () => {
    const claimUrl = 'http://test.com';
    const saltedFields = { secret: '123abc' };
    const token = await userClaims.createProofClaim(claimUrl, saltedFields);
    const claim = await userClaims.jwt.verify(token, userClaims.keys.publicKey, { algorithm: 'ES256', noTimestamp: true }) as IClaim;
    claim.should.include({ did: userDdid, signer: userDdid, claimUrl });
    claim.should.have.nested.property('claimData.secret.h').which.instanceOf(Array);
    claim.should.have.nested.property('claimData.secret.s').which.instanceOf(Array);
  });
});
