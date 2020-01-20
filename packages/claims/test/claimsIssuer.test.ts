import chai from 'chai';
import chaiAsPromise from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { Resolver } from '@ew-did-registry/did-resolver';
import { ClaimsIssuer } from '../src/claimsIssuer';
import { ClaimsUser } from '../src/claimsUser';

chai.use(chaiAsPromise);
chai.should();

describe('[CLAIMS PACKAGE/ISSUER CLAIMS]', () => {
  const user = new Keys();
  const issuer = new Keys();
  const resolver = new Resolver();
  const claimsIssuer = new ClaimsIssuer(issuer, resolver);
  const claimsUser = new ClaimsUser(user, resolver);

  it('if issuer receives correct token, he must issue token signed by him', async () => {
    const token = await claimsUser.createPublicClaim({});
    await (claimsIssuer.issuePublicClaim(token)).should.be.fulfilled;
  });

  it('if issuer receives incorrect token, he must reject to issue token', async () => {
    let token = await claimsUser.createPublicClaim({});
    const unauthorized = new Keys();
    const claimsUnauthorized = new ClaimsUser(unauthorized, resolver);
    const payload = claimsUnauthorized.jwt.decode(token);
    token = await claimsUnauthorized.jwt.sign(payload, { algorithm: 'ES256', noTimestamp: true });
    await (claimsIssuer.issuePublicClaim(token)).should.be.rejected;
  });
});
