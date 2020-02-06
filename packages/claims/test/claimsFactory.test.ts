/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Keys } from '@ew-did-registry/keys';
import {
  IResolver,
  Resolver,
  Operator,
  ethrReg,
  defaultResolverSettings,
  IOperator, IResolverSettings
} from '@ew-did-registry/did-resolver';
import { Networks } from '@ew-did-registry/did';
import { ClaimsFactory } from '../src/claimsFactory';
import { IProofData } from '../src/models';
import Web3 from "web3";
import {ContractFactory, ethers, Wallet} from "ethers";
import {IClaimsIssuer, IClaimsUser, IClaimsVerifier} from "../src";

chai.use(chaiAsPromised);

describe('[CLAIMS PACKAGE/FACTORY CLAIMS]', function () {
  // Each participant represented by its keys
  this.timeout(0);
  const user = new Keys({
    privateKey: '73b2e47a3a9b60cf91eae4fa4a5c2ce1c8ea019e8994b76cdceca6c2a03e957e',
    publicKey: '02cb7cd2b5eee35d55e1d5202862d4341fdd28f9b9739f370a254e3cabc368d9bd',
  });
  const userAddress = '0x5AAab994B9103F427bEDedc2173f33e347a3DeE2';
  const userDid = `did:${Networks.EnergyWeb}:${userAddress}`;
  let userOperator: IOperator;

  const issuer = new Keys({
    privateKey: '7809091ad3646a9505b7ae5597f9f344e43df9e4d4fb12ecc48bda87c7bbda2c',
    publicKey: '0315a744bd5583193d39f2b158abec9c4fca8871e83e83b21bf9fc7bd07c842a61',
  });
  const issuerAddress = '0x116b43b21F082e941c78486809AE0010bb60DFA4';
  const issuerDid = `did:${Networks.Ethereum}:${issuerAddress}`;
  let issuerOperator: IOperator;

  const verifier = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  });

  let claimsUser: IClaimsUser;
  let claimsIssuer: IClaimsIssuer;
  let claimsVerifier: IClaimsVerifier;

  const GANACHE_PORT = 8544;
  const web3 = new Web3(`http://localhost:${GANACHE_PORT}`);
  let resolver: IResolver;

  before(async () => {
    const accounts = await web3.eth.getAccounts();
    await web3.eth.sendTransaction({
      from: accounts[2],
      to: userAddress,
      value: '1000000000000000000',
    });
    await web3.eth.sendTransaction({
      from: accounts[2],
      to: issuerAddress,
      value: '1000000000000000000',
    });

    const provider = new ethers.providers.Web3Provider(web3.currentProvider as any);
    const registryFactory = new ContractFactory(ethrReg.abi, ethrReg.bytecode,
        new Wallet('0x49b2e2b48cfc25fda1d1cbdb2197b83902142c6da502dcf1871c628ea524f11b', provider));
    const registry = await registryFactory.deploy();
    const resolverSetting: IResolverSettings = {
      abi: defaultResolverSettings.abi,
      provider: defaultResolverSettings.provider,
      address: registry.address,
    };
    resolver = new Resolver(resolverSetting);
    userOperator = new Operator(user, resolverSetting);
    issuerOperator = new Operator(issuer, resolverSetting);

    console.log(`registry: ${registry.address}`);

    await userOperator.deactivate(userDid);
    await userOperator.create();

    await issuerOperator.deactivate(issuerDid);
    await issuerOperator.create();

    claimsUser = new ClaimsFactory(user, userOperator).createClaimsUser();
    claimsIssuer = new ClaimsFactory(issuer, issuerOperator).createClaimsIssuer();
    claimsVerifier = new ClaimsFactory(verifier, resolver).createClaimsVerifier();
  });

  it('workflow of private claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const privateData = { secret: '123', anotherSecret: 'shhh' };
    const {
      token: privateToken,
      saltedFields,
    } = await claimsUser.createPrivateClaim(privateData, issuerDid);
    // Issuer side
    const issuedToken = await claimsIssuer.issuePrivateClaim(privateToken);
    // Application/User side
    await claimsUser.verifyPrivateClaim(issuedToken, saltedFields);
    // expect(verified).to.be.true;
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
    const proofToken = await claimsUser.createProofClaim(claimUrl, encryptedSaltedFields);
    // Verifier side
    await claimsVerifier.verifyPrivateProof(proofToken, issuedToken);
  });

  it('workflow of public claim generation, issuance and presentation should pass', async () => {
    // User(Subject) side
    const publicData = { public: '123' };
    console.log('before createPublicClaim')
    const token = await claimsUser.createPublicClaim(publicData);
    console.log('before issuePublicClaim')
    // Issuer side
    const issuedToken = await claimsIssuer.issuePublicClaim(token);
    console.log('before verifyPublicClaim')
    // Application/User side
    await claimsUser.verifyPublicClaim(issuedToken, publicData);
    console.log('before verifyPublicProof')
    // Verifier side
    await claimsVerifier.verifyPublicProof(issuedToken);
  });
});
