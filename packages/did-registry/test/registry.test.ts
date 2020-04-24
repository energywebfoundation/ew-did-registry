import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { ethrReg, Operator } from '@ew-did-registry/did-ethr-resolver';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import { IClaimsIssuer, IClaimsUser, IProofData, IPublicClaim, } from '@ew-did-registry/claims';
import { proxyFactoryBuild } from '@ew-did-registry/proxyidentity';
import { DidStore } from '@ew-did-registry/did-ipfs-store';
import { JsonRpcProvider } from 'ethers/providers';
import { ContractFactory, providers } from 'ethers';
import DIDRegistry from '../src';
import { getSettings, shutDownIpfsDaemon, spawnIpfsDaemon } from '../../../tests';

chai.use(chaiAsPromised);
chai.should();

describe('[REGISTRY PACKAGE]', function () {
  this.timeout(0);
  const userKeys = new Keys();
  const userAddress = userKeys.getAddress();
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;

  const issuerKeys = new Keys();
  const issuerAddress = issuerKeys.getAddress();
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;

  const verifierKeys = new Keys();
  const verifierAddress = verifierKeys.getAddress();
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}`;

  let user: DIDRegistry;
  let userClaims: IClaimsUser;
  let issuer: DIDRegistry;
  let issuerClaims: IClaimsIssuer;
  let verifier: DIDRegistry;

  before(async () => {
    const resolverSettings = await getSettings([userAddress, issuerAddress, verifierAddress]);
    const ipfsApi = await spawnIpfsDaemon();
    const store = new DidStore(ipfsApi);
    user = new DIDRegistry(userKeys, userDid, new Operator(userKeys, resolverSettings), store);
    userClaims = user.claims.createClaimsUser();
    issuer = new DIDRegistry(issuerKeys, issuerDid, new Operator(issuerKeys, resolverSettings), store);
    issuerClaims = issuer.claims.createClaimsIssuer();
    verifier = new DIDRegistry(verifierKeys, verifierDid, new Operator(verifierKeys, resolverSettings), store);
    await user.document.create();
    await issuer.document.create();
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });

  it('user public claim should be issued and verified', async () => {
    const publicData = {
      name: 'Lisence',
      sn: 'abc123',
    };
    const token = await userClaims.createPublicClaim(publicData);
    // send token to Issuer
    const issuedToken = await issuerClaims.issuePublicClaim(token);
    // send to User
    const claim: IPublicClaim = user.jwt.decode(issuedToken) as IPublicClaim;
    expect(claim.did).equal(userDid);
    expect(claim.signer).equal(issuerDid);
    expect(claim.claimData).deep.equal(publicData);
    const claimUrl = await userClaims.publishPublicClaim(issuedToken, publicData);
    expect(claimUrl).to.not.be.empty;
  });

  it('user can prove ownership of the private data', async () => {
    const privateData = {
      secret: '123',
      notSecret: 'string',
    };
    const { token, saltedFields } = await userClaims.createPrivateClaim(privateData, issuerDid);
    // User sends claim to Issuer
    const issued = await issuerClaims.issuePrivateClaim(token);
    // Issuer sends claim to User
    const claimUrl = await userClaims.publishPrivateClaim(issued, saltedFields);
    expect(claimUrl).to.not.be.empty;
    const encryptedSaltedFields: IProofData = {
      secret: { value: saltedFields.secret, encrypted: true },
      notSecret: { value: saltedFields.notSecret, encrypted: false },
    };
    const proof = await userClaims.createProofClaim(claimUrl, encryptedSaltedFields);
    const verified = verifier.claims.createClaimsVerifier().verifyPrivateProof(proof);
    return verified.should.be.fulfilled;
  });

  it('createProxy() should return proxy address', async () => {
    const { abi: abi1056, bytecode: bytecode1056 } = ethrReg;
    const { abi: proxyFactoryAbi, bytecode: proxyFactoryBytecode } = proxyFactoryBuild;
    const provider = new JsonRpcProvider('http://localhost:8544');
    const deployer: providers.JsonRpcSigner = provider.getSigner(0);
    const erc1056Factory = new ContractFactory(abi1056, bytecode1056, deployer);
    const erc1056 = await (await erc1056Factory.deploy()).deployed();
    const proxyFactoryCreator = new ContractFactory(proxyFactoryAbi, proxyFactoryBytecode, deployer);
    const proxyFactory = await (await proxyFactoryCreator.deploy(erc1056.address)).deployed();
    const proxy = await DIDRegistry.createProxy(proxyFactory);
    expect(proxy).to.match(/^0x[a-fA-F0-9]{40}$/);
  });
});
