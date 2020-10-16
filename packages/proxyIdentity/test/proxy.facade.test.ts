import chai, { expect } from 'chai';
import assetArray from 'chai-arrays';
import chaiAsPromised from 'chai-as-promised';
import { providers, ContractFactory, Contract } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { createProxy, proxyFactoryBuild } from '../src';
import { ethrReg } from '../constants/EthereumDIDRegistry';
import { abi as abi1155, bytecode as bytecode1155 } from '../build/contracts/ERC1155Multiproxy.json';

const { abi: abi1056, bytecode: bytecode1056 } = ethrReg;
const { abi: proxyFactoryAbi, bytecode: proxyFactoryBytecode } = proxyFactoryBuild;

chai.use(chaiAsPromised);
chai.use(assetArray);
chai.should();

describe('[PROXY IDENTITY PACKAGE / PROXY FACADE]', function () {
  this.timeout(0);
  const provider = new JsonRpcProvider('http://localhost:8544');
  const oem: providers.JsonRpcSigner = provider.getSigner(0);
  let proxyFactory: Contract;
  let erc1155: Contract;
  let device1: Contract;
  let device2: Contract;
  const baseMetadataUri = 'https://token-cdn-domain/{id}.json';

  beforeEach(async () => {
    const erc1056Factory = new ContractFactory(abi1056, bytecode1056, oem);
    const erc1056 = await (await erc1056Factory.deploy()).deployed();
    const erc1155Factory = new ContractFactory(abi1155, bytecode1155, oem);
    erc1155 = await (await erc1155Factory.deploy(baseMetadataUri)).deployed();
    const proxyFactoryCreator = new ContractFactory(
      proxyFactoryAbi, proxyFactoryBytecode, oem,
    );
    proxyFactory = await (await proxyFactoryCreator.deploy(erc1056.address, erc1155.address)).deployed();
  });

  it('created proxies should be owned by oem', async () => {
    device1 = await createProxy(proxyFactory, 1);
    expect(await device1.owner()).equal(await oem.getAddress());
    device2 = await createProxy(proxyFactory, 2);
    expect(await device2.owner()).equal(await oem.getAddress());
  });

  it.only('should return list of owned tokens', async () => {
    const id2 = 2;
    const id3 = 3;
    await createProxy(proxyFactory, id2);
    await createProxy(proxyFactory, id3);

    const oemIds = (await erc1155.tokensOwnedBy(await oem.getAddress())).map((id: string) => parseInt(id, 16));
    expect(oemIds).to.be.equalTo([id2, id3]);
  });

  it.only('should return list of created tokens', async () => {
    const id2 = 2;
    const id3 = 3;
    await createProxy(proxyFactory, id2);
    await createProxy(proxyFactory, id3);

    const ids = (await erc1155.tokensCreatedBy(proxyFactory.address)).map((id: string) => parseInt(id, 16));
    expect(ids).to.be.equalTo([id2, id3]);
  });
});
