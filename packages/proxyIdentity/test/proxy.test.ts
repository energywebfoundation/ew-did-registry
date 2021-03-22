import { providers, ContractFactory } from 'ethers';
import { abi as IMAbi, bytecode as IMBytecode } from '../build/contracts/IdentityManager.json';
import { abi as proxyAbi, bytecode as proxyBytecode } from '../build/contracts/OfferableIdentity.json';
import { abi as erc1056Abi, bytecode as erc1056Bytecode } from '../constants/ERC1056.json';
import { identityTestSuite } from './offerable.identity.testSuite';
import { offerableIdentityOperatorTestSuite } from './offerable.identity-operator.testSuite';

const { JsonRpcProvider } = providers;

describe('[PROXY IDENTITY PACKAGE]', function () {
  this.timeout(0);
  const provider = new JsonRpcProvider('http://localhost:8544');
  const deployer = provider.getSigner(0);

  before(async function () {
    const owner = provider.getSigner(1);

    const identityManagerFactory = new ContractFactory(IMAbi, IMBytecode, deployer);
    const manager = await identityManagerFactory.deploy();

    const erc1056Factory = new ContractFactory(erc1056Abi, erc1056Bytecode, deployer);
    const erc1056 = await erc1056Factory.deploy();

    const identityFactory = new ContractFactory(proxyAbi, proxyBytecode, deployer);

    Object.assign(this, {
      manager, provider, identityFactory, owner, erc1056,
    });
  });

  describe('OFFERABLE IDENTITY TESTS', identityTestSuite);
  describe('PROXY OPERATOR TESTS', offerableIdentityOperatorTestSuite);
});
