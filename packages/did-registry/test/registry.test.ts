import {expect} from 'chai';
import {ethrReg, Operator, Resolver} from '@ew-did-registry/did-ethr-resolver';
import {
  Algorithms,
  DIDAttribute,
  Encoding,
  IResolverSettings,
  IUpdateData,
  PubKeyType,
} from '@ew-did-registry/did-resolver-interface';
import {Keys} from '@ew-did-registry/keys';
import {Methods} from '@ew-did-registry/did';
import {IClaimsIssuer, IClaimsUser, IPrivateClaim, IProofData, IPublicClaim,} from '@ew-did-registry/claims';
import {proxyFactoryBuild} from '@ew-did-registry/proxyidentity';
import {DIDDocumentFull} from '@ew-did-registry/did-document';
import {JsonRpcProvider} from 'ethers/providers';
import {ContractFactory, providers} from 'ethers';
import DIDRegistry from '../src';
import {getSettings} from '../../../tests/init-ganache';

describe('[REGISTRY PACKAGE]', function () {
  this.timeout(0);
  const userKeys = new Keys({
    privateKey: '813e864ffa199f3cd38d8dcf2b097a2e2b226e000f3a05267eee23d0da7086f4',
    publicKey: '029462cf4b9ece1f84b600e3d924641aa359f068f1876cbf08b1b345e4c9831f23',
  });
  const userAddress = '0x7551eD4be4eFd75E602189E9d59af448A564AB3a';
  const userDid = `did:${Methods.Erc1056}:${userAddress}`;

  const issuerKeys = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  });
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B';
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}`;

  const verifierKeys = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  });
  const verifierAddress = '0x6C30b191A96EeE014Eb06227D50e9FB3CeAbeafd';
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}`;

  let userOperator: Operator;
  let issuerOperator: Operator;
  let user: DIDRegistry;
  let userClaims: IClaimsUser;
  let issuer: DIDRegistry;
  let issuerClaims: IClaimsIssuer;
  let verifier: DIDRegistry;
  const validity = 5 * 60 * 1000; // 5 minutes
  let resolverSettings: IResolverSettings;

  before(async () => {
    resolverSettings = await getSettings([userAddress, issuerAddress, verifierAddress]);
    userOperator = new Operator(userKeys, resolverSettings);
    issuerOperator = new Operator(issuerKeys, resolverSettings);
    user = new DIDRegistry(userKeys, userDid, new Resolver(resolverSettings));
    userClaims = user.claims.createClaimsUser();
    issuer = new DIDRegistry(issuerKeys, issuerDid, new Resolver(resolverSettings));
    issuerClaims = issuer.claims.createClaimsIssuer();
    verifier = new DIDRegistry(verifierKeys, verifierDid, new Resolver(resolverSettings));
    await userOperator.deactivate(userDid);
    await userOperator.create();
    await issuerOperator.deactivate(issuerDid);
    await issuerOperator.create();
  });

  it('user public claim should be issued and verified', async () => {
    const publicData = {
      name: 'Tesla Model 3',
      capacity: '10',
      price: '500',
    };
    const token = await userClaims.createPublicClaim(publicData);
    // send token to Issuer
    const issuedToken = await issuerClaims.issuePublicClaim(token);
    // send to Verifier/Owner
    await userClaims.verifyPublicClaim(issuedToken, publicData);
    const claim: IPublicClaim = userClaims.jwt.decode(issuedToken) as IPublicClaim;
    expect(claim.did).equal(userDid);
    expect(claim.signer).equal(issuerDid);
    expect(claim.claimData).deep.equal(publicData);
    // Issued token valid, issuer can be added to delegates
    const updateData: IUpdateData = {
      algo: Algorithms.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: issuerAddress,
    };
    const userLigthDoc = user.documentFactory.createLite(new Resolver(resolverSettings));
    await userLigthDoc.read(userDid);
    const userFullDoc = user.documentFactory.createFull(new Operator(userKeys, resolverSettings));
    expect(userFullDoc).instanceOf(DIDDocumentFull);
    await userFullDoc.update(DIDAttribute.Authenticate, updateData, validity);
    await userLigthDoc.read(userDid);
  });

  it('user can prove his ownership of his issued and verified private claim', async () => {
    const privateData = {
      secret: '123',
      notSecret: 'string',
    };
    const { token, saltedFields } = await userClaims.createPrivateClaim(privateData, issuerDid);
    // send token to Issuer
    const issuedToken = await issuerClaims.issuePrivateClaim(token);
    // send to Verifier/Owner
    await userClaims.verifyPrivateClaim(issuedToken, saltedFields);
    const claim: IPrivateClaim = userClaims.jwt.decode(issuedToken) as IPrivateClaim;
    expect(claim.did).equal(userDid);
    expect(claim.signer).equal(issuerDid);
    // Issued token valid, issuer can be added to delegates
    const updateData: IUpdateData = {
      algo: Algorithms.Secp256k1,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      delegate: issuerAddress,
    };
    const userLigthDoc = user.documentFactory.createLite(new Resolver(resolverSettings));
    await userLigthDoc.read(userDid);
    let document = userLigthDoc.didDocument;
    const userFullDoc = user.documentFactory.createFull(userOperator);
    expect(userFullDoc).instanceOf(DIDDocumentFull);
    const updated = await userFullDoc.update(DIDAttribute.Authenticate, updateData, validity);
    expect(updated).is.true;
    await userLigthDoc.read(userDid);
    const expectedPkId = `${userDid}#delegate-${PubKeyType.VerificationKey2018}-${issuerAddress}`;
    expect(document.publicKey.find((pk) => pk.id === expectedPkId)).to.not.undefined;
    const claimUrl = 'http://test.service.com';
    const encryptedSaltedFields: IProofData = {};
    let counter = 0;
    Object.entries(saltedFields).forEach(([key, value]) => {
      if (counter % 2 === 0) {
        encryptedSaltedFields[key] = {
          value,
          encrypted: true,
        };
      } else {
        encryptedSaltedFields[key] = {
          value,
          encrypted: false,
        };
      }
      // eslint-disable-next-line no-plusplus
      counter++;
    });
    const proofToken = await userClaims.createProofClaim(claimUrl, encryptedSaltedFields);
    await verifier.claims.createClaimsVerifier().verifyPrivateProof(proofToken, issuedToken);
    document = userLigthDoc.didDocument;
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
