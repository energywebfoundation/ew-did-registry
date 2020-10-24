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

describe.only('[PROXY IDENTITY PACKAGE / PROXY FACADE]', function () {
  this.timeout(0);
  const provider = new JsonRpcProvider('http://localhost:8544');
  const oem: providers.JsonRpcSigner = provider.getSigner(0);
  let proxyFactory: Contract;
  let erc1155: Contract;
  let device1: Contract;
  let device2: Contract;

  beforeEach(async () => {
    const erc1056Factory = new ContractFactory(abi1056, bytecode1056, oem);
    const erc1056 = await (await erc1056Factory.deploy()).deployed();
    const erc1155Factory = new ContractFactory(abi1155, bytecode1155, oem);
    erc1155 = await (await erc1155Factory.deploy()).deployed();
    const proxyFactoryCreator = new ContractFactory(
      proxyFactoryAbi, proxyFactoryBytecode, oem,
    );
    proxyFactory = await (await proxyFactoryCreator.deploy(erc1056.address, erc1155.address)).deployed();
  });

  it('created proxies should be owned by oem', async () => {
    device1 = await createProxy(proxyFactory, '1');
    expect(await device1.owner()).equal(await oem.getAddress());
    device2 = await createProxy(proxyFactory, '2');
    expect(await device2.owner()).equal(await oem.getAddress());
  });

  it('should return list of owned tokens', async () => {
    const serial2 = '2';
    const serial3 = '3';
    await createProxy(proxyFactory, serial2);
    await createProxy(proxyFactory, serial3);

    const oemIds = (await erc1155.tokensOwnedBy(await oem.getAddress()));

    expect(oemIds).to.be.equalTo([serial2, serial3]);
  });

  it('should return list of created tokens', async () => {
    const serial2 = '2';
    const serial3 = '3';
    await createProxy(proxyFactory, serial2);
    await createProxy(proxyFactory, serial3);

    const serials = (await erc1155.tokensCreatedBy(proxyFactory.address));

    expect(serials).to.be.equalTo([serial2, serial3]);
  });

  it('should list all tokens', async () => {
    await createProxy(proxyFactory, '2');
    await createProxy(proxyFactory.connect(oem), '3');
    await createProxy(proxyFactory, '4');

    const serials = (await erc1155.allTokens());

    expect(serials).to.be.equalTo(['2', '3', '4']);
  });

  it.only('should update metadata uri', async () => {
    const device = await createProxy(proxyFactory, '1');
    const exampleUri = 'https://example.com';

    expect(await device.uri()).equal('');

    await device.updateUri(exampleUri);

    expect(await device.uri()).equal(exampleUri);
  });
});
