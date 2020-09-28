import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { providers, ContractFactory, Contract } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { createProxy, proxyFactoryBuild } from '../src';
import { ethrReg } from '../constants/EthereumDIDRegistry';

const { abi: abi1056, bytecode: bytecode1056 } = ethrReg;
const { abi: proxyFactoryAbi, bytecode: proxyFactoryBytecode } = proxyFactoryBuild;

chai.use(chaiAsPromised);
chai.should();

describe.only('[PROXY IDENTITY PACKAGE / PROXY FACADE]', function () {
  this.timeout(0);
  const provider = new JsonRpcProvider('http://localhost:8544');
  const oem: providers.JsonRpcSigner = provider.getSigner(0);
  const assetOwner: providers.JsonRpcSigner = provider.getSigner(2);
  let proxyFactory: Contract;
  let device1: Contract;
  let device2: Contract;

  before(async () => {
    const erc1056Factory = new ContractFactory(abi1056, bytecode1056, oem);
    const erc1056 = await (await erc1056Factory.deploy()).deployed();
    const proxyFactoryCreator = new ContractFactory(
      proxyFactoryAbi, proxyFactoryBytecode, oem,
    );
    proxyFactory = await (await proxyFactoryCreator.deploy(erc1056.address)).deployed();
  });

  it('created proxies should be owned by oem', async () => {
    device1 = await createProxy(proxyFactory);
    expect(await device1.owner()).equal(await oem.getAddress());
    device2 = await createProxy(proxyFactory);
    expect(await device2.owner()).equal(await oem.getAddress());
  });

  it('oem can transfer device1 ownership to asset owner', async () => {
    const ownerAddr = await assetOwner.getAddress();
    await device1.addRecoveryAgent(ownerAddr);
    expect(await device1.recoveryAgents(ownerAddr)).true;
    device1.connect(assetOwner);
    await device1.changeOwner(ownerAddr);
    expect(await device1.owner()).equal(ownerAddr);
  });
});
