import chai from 'chai';
import chaiAsPromise from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import { Resolver, Operator } from '@ew-did-registry/did-resolver';
import { ClaimsIssuer } from '../src/claimsIssuer';
import { ClaimsUser } from '../src/claimsUser';

chai.use(chaiAsPromise);
chai.should();

describe('[CLAIMS PACKAGE/ISSUER CLAIMS]', function () {
  this.timeout(0);
  const user = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const userOperator = new Operator(user);
  const issuer = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });
  const issuerOperator = new Operator(issuer);
  const resolver = new Resolver();
  const claimsIssuer = new ClaimsIssuer(issuer, resolver);
  const claimsUser = new ClaimsUser(user, resolver);

  before(async () => {
    await userOperator.create();
    await issuerOperator.create();
  });

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
