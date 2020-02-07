import chai from 'chai';
import { Keys } from '@ew-did-registry/keys';
import {
  Resolver,
  Operator,
  IOperator,
  IResolver,
} from '@ew-did-registry/did-resolver';
import { Networks } from '@ew-did-registry/did';
import { decrypt } from 'eciesjs';
import { ClaimsUser } from '../src/claimsUser';
import { IPrivateClaim, IProofClaim } from '../src/models';
import { getSettings } from '../../../tests/init-ganache';
import { IClaimsUser } from '../src';

chai.should();

describe('[CLAIMS PACKAGE/USER CLAIMS]', function () {
  this.timeout(0);
  const user = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const userAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const userDdid = `did:${Networks.Ethereum}:${userAddress}`;
  const issuer = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B';
  const issuerDid = `did:${Networks.Ethereum}:${issuerAddress}`;

  let userOperator: IOperator;
  let issuerOperator: IOperator;
  let resolver: IResolver;
  let userClaims: IClaimsUser;

  before(async () => {
    const resolverSettings = await getSettings([issuerAddress, userAddress]);
    console.log(`registry: ${resolverSettings.address}`);

    userOperator = new Operator(user, resolverSettings);
    issuerOperator = new Operator(issuer, resolverSettings);
    resolver = new Resolver(resolverSettings);
    userClaims = new ClaimsUser(user, resolver);

    await userOperator.create();
    await issuerOperator.create();
  });

  it('createPublicClaim should create token with claim data', async () => {
    const publicData = {
      name: 'John',
    };
    const token = await userClaims.createPublicClaim(publicData);
    const claim = await userClaims.jwt.verify(token, userClaims.keys.publicKey, { algorithm: 'ES256', noTimestamp: true });
    claim.should.deep.equal({
      did: userDdid,
      signer: userDdid,
      claimData: publicData,
    });
  });

  it('createPrivateToken should create token with data decryptable by issuer', async () => {
    const secret = '123';
    const { token, saltedFields } = await userClaims.createPrivateClaim({ secret }, issuerDid);
    const claim: IPrivateClaim = await userClaims.jwt.decode(token, { algorithm: 'ES256', noTimestamp: true }) as IPrivateClaim;
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
    const claim = await userClaims.jwt.verify(token, userClaims.keys.publicKey, { algorithm: 'ES256', noTimestamp: true }) as IProofClaim;
    claim.should.include({ did: userDdid, signer: userDdid, claimUrl });
    claim.should.have.nested.property('proofData.secret.value.h').which.instanceOf(Array);
    claim.should.have.nested.property('proofData.secret.value.s').which.instanceOf(Array);
  });
});
