import { Contract, providers, ContractFactory } from 'ethers';
import { JsonRpcProvider, JsonRpcSigner } from 'ethers/providers';
import { expect } from 'chai';
import { ethrReg } from '../../did-resolver';
import { abi as proxyFactoryAbi, bytecode as proxyFactoryBytecode } from '../build/contracts/ProxyFactory.json';

const { abi: abi1056, bytecode: bytecode1056 } = ethrReg;

describe('[PROXY IDENTITY PACKAGE/PROXY CONTRACT]', function () {
  this.timeout(0);
  let erc1056: Contract;
  let proxyFactory: Contract;
  const provider = new JsonRpcProvider('http://localhost:8544');
  const deployer: providers.JsonRpcSigner = provider.getSigner(0);
  let deployerAddress: string;
  const proxyFactoryCreator = new ContractFactory(proxyFactoryAbi, proxyFactoryBytecode, deployer);
  const erc1056Factory = new ContractFactory(abi1056, bytecode1056, deployer);
  let identity: string;

  beforeEach(async () => {
    deployerAddress = await deployer.getAddress();
    erc1056 = await (await erc1056Factory.deploy()).deployed();
    proxyFactory = await (await proxyFactoryCreator.deploy(erc1056.address, { value: 1E15 })).deployed();
  });

  it('create() should set sender as owner of created proxy', async () => {
    const owner: providers.JsonRpcSigner = provider.getSigner(1);
    const ownerAddress: string = await owner.getAddress();
    const proxy: Contract = await (await proxyFactory.create({ from: ownerAddress })).wait();
    const proxyOwner = await proxy.owner();
    expect(proxyOwner).equal(ownerAddress);
  });
});
