import chai from 'chai';
import { Keys } from '@ew-did-registry/keys';
import { Resolver } from '@ew-did-registry/did-resolver';
import { Networks } from '@ew-did-registry/did';
import { decrypt } from 'eciesjs';
import { ClaimsUser } from '../src/claimsUser';
import { IClaimData, IClaim } from '../src/models';

chai.should();

describe('[CLAIMS PACKAGE/USER CLAIMS]', () => {
  const user = new Keys();
  const issuer = new Keys();
  const did = `did:${Networks.Ethereum}:0x${user.publicKey}`;
  const issuerDid = `did:${Networks.Ethereum}:0x${issuer.publicKey}`;
  const claims = new ClaimsUser(user, new Resolver());

  it('createPublicClaim should create token with claim data', async () => {
    const claimData: IClaimData = {
      name: 'John',
    };
    const token = await claims.createPublicClaim(claimData);
    const claim = await claims.jwt.verify(token, claims.keys.publicKey, { algorithm: 'ES256', noTimestamp: true });
    claim.should.deep.equal({
      did,
      signer: did,
      claimData,
    });
  });

  it('createPrivateToken should create token with data decryptable by issuer', async () => {
    const secret = '123';
    const { token, saltedFields } = await claims.createPrivateClaim({ secret }, issuerDid);
    const claim: IClaim = await claims.jwt.verify(token, claims.keys.publicKey, { algorithm: 'ES256', noTimestamp: true }) as IClaim;
    const decryped = decrypt(
      issuer.privateKey,
      Buffer.from((claim.claimData.secret as { data: Buffer }).data),
    );
    decryped.toString().should.equal(saltedFields.secret);
  });

  it('createProofClaim should return well formed proof claim', async () => {
    const claimUrl = 'http://test.com';
    const saltedFields = { secret: '123abc' };
    const token = await claims.createProofClaim(claimUrl, saltedFields);
    const claim = await claims.jwt.verify(token, claims.keys.publicKey, { algorithm: 'ES256', noTimestamp: true }) as IClaim;
    claim.should.include({ did, signer: did, claimUrl });
    claim.should.have.nested.property('claimData.secret.h').which.instanceOf(Array);
    claim.should.have.nested.property('claimData.secret.s').which.instanceOf(Array);
  });
});
