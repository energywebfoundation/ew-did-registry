import chai from 'chai';
import chaiAsPromise from 'chai-as-promised';
import { IKeys, Keys } from '../../keys';
import { Operator, Resolver } from '../../did-ethr-resolver';
import {
  IOperator,
  IResolver,
  IResolverSettings,
} from '../../did-resolver-interface';
import { ClaimsUser } from '../src/claimsUser';
import { ClaimsFactory } from '../src/claimsFactory';
import { IClaimsIssuer, IClaimsUser } from '../src';
import { getSettings } from '../../../tests/init-ganache';

chai.use(chaiAsPromise);
chai.should();

describe('[CLAIMS PACKAGE/ISSUER CLAIMS]', function () {
  this.timeout(0);
  const user = new Keys({
    privateKey: 'abbe68d0ead3b5f5d8df7c94ad2169afeb61c58c129081bae3c9fec17f999671',
    publicKey: '037fae1748fa7e45cebe70f9a3e51c9a5af378cf7aca4373b14a423fb550afc6ef',
  });
  const issuer: IKeys = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });

  let userOperator: IOperator;
  let issuerOperator: IOperator;
  let resolver: IResolver;
  let claimsIssuer: IClaimsIssuer;
  let claimsUser: IClaimsUser;

  before(async () => {
    const resolverSettings: IResolverSettings = await getSettings([issuer.getAddress(), user.getAddress()]);
    console.log(`registry: ${resolverSettings.address}`);

    resolver = new Resolver(resolverSettings);
    userOperator = new Operator(user, resolverSettings);
    issuerOperator = new Operator(issuer, resolverSettings);

    await userOperator.create();
    await issuerOperator.create();

    claimsUser = new ClaimsFactory(user, userOperator).createClaimsUser();
    claimsIssuer = new ClaimsFactory(issuer, issuerOperator).createClaimsIssuer();
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
    token = await claimsUnauthorized.jwt.sign(payload, {
      algorithm: 'ES256',
      noTimestamp: true,
    });
    await (claimsIssuer.issuePublicClaim(token)).should.be.rejected;
  });
});
