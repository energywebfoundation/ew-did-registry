import chai, { expect } from 'chai';
import assetArray from 'chai-arrays';
import chaiAsPromised from 'chai-as-promised';
import { ContractFactory, Contract } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { ethrReg } from '../constants/EthereumDIDRegistry';
import { abi as abi1155, bytecode as bytecode1155 } from '../build/contracts/ERC1155Multiproxy.json';
import { ProxyManager } from '../src/ProxyManager';

const { abi: abi1056, bytecode: bytecode1056 } = ethrReg;

chai.use(chaiAsPromised);
chai.use(assetArray);
chai.should();

describe('[PROXY IDENTITY PACKAGE / PROXY MANAGER]', function () {
  this.timeout(0);
  const provider = new JsonRpcProvider('http://localhost:8544');
  const oem = provider.getSigner(0);
  const installer = provider.getSigner(1);
  let erc1155: Contract;
  let device1: Contract;
  let device2: Contract;
  let pm: ProxyManager;

  const id1 = '1';
  const id2 = '2';
  const id3 = '3';
  const id4 = '4';

  beforeEach(async () => {
    const erc1056Factory = new ContractFactory(abi1056, bytecode1056, oem);
    const erc1056 = await (await erc1056Factory.deploy()).deployed();
    const erc1155Factory = new ContractFactory(abi1155, bytecode1155, oem);
    erc1155 = await (await erc1155Factory.deploy()).deployed();
    pm = new ProxyManager(erc1056.address, erc1155.address, oem);
  });

  it('created proxies should be owned by oem', async () => {
    device1 = await pm.createProxy('1');
    expect(await device1.owner()).equal(await oem.getAddress());
    device2 = await pm.createProxy('2');
    expect(await device2.owner()).equal(await oem.getAddress());
  });

  it('createBatch() should set sender as owner of created proxies', async () => {
    const serials = ['1', '2'];
    const proxies = await pm.createProxyBatch(serials);

    const owners = await Promise.all(proxies.map((p) => p.owner()));

    const oemAddr = await oem.getAddress();
    expect(owners.every((o) => o === oemAddr)).true;
  });

  it('should return list of all proxies', async () => {
    await pm.connect(oem).createProxyBatch(['1', '2']);
    await pm.connect(installer).createProxyBatch(['3', '4']);

    expect(await pm.allProxies()).to.be.equalTo(['1', '2', '3', '4']);
  });

  it('should list created tokens', async () => {
    await pm.connect(oem).createProxyBatch([id1, id2]);
    await pm.connect(installer).createProxyBatch([id3, id4]);

    expect(await pm.proxiesOwnedBy(await oem.getAddress())).to.be.equalTo([id1, id2]);
    expect(await pm.proxiesOwnedBy(await installer.getAddress())).to.be.equalTo([id3, id4]);
  });

  it('owner can be changed', async () => {
    await pm.connect(oem).createProxyBatch([id1, id2]);
    await pm.connect(installer).createProxyBatch([id3, id4]);

    await pm.connect(oem).changeOwner(id1, await installer.getAddress());
    expect(await pm.proxiesOwnedBy(await installer.getAddress())).to.be.equalTo([id1, id3, id4]);
  });

  it('owner can be changed batched', async () => {
    await pm.connect(oem).createProxyBatch([id1, id2]);
    await pm.connect(installer).createProxyBatch([id3, id4]);

    await pm.connect(oem).changeOwnerBatch([id1, id2], await installer.getAddress());
    expect(await pm.proxiesOwnedBy(await installer.getAddress()))
      .to.be.equalTo([id1, id2, id3, id4]);
  });

  it('should update metadata uri', async () => {
    const device = await pm.createProxy('1');
    const exampleUri = 'https://example.com';

    expect(await device.uri()).equal('');

    await device.updateUri(exampleUri);

    expect(await device.uri()).equal(exampleUri);
  });
});
