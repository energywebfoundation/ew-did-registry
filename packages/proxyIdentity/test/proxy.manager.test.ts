import chai, { expect } from 'chai';
import assetArray from 'chai-arrays';
import chaiAsPromised from 'chai-as-promised';
import { ContractFactory, Contract, providers } from 'ethers';
import { ethrReg } from '../constants/EthereumDIDRegistry';
import { abi as abi1155, bytecode as bytecode1155 } from '../build/contracts/ERC1155Multiproxy.json';
import { ProxyManager } from '../src/ProxyManager';

const { JsonRpcProvider } = providers;

const { abi: abi1056, bytecode: bytecode1056 } = ethrReg;
const { mapProxiesBy } = ProxyManager;

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

  it('createProxyBatch() should set sender as owner of created proxies', async () => {
    const serials = ['1', '2'];
    const proxies = await pm.createProxyBatch(serials);

    const owners = await Promise.all(proxies.map((p) => p.owner()));

    const oemAddr = await oem.getAddress();
    expect(owners.every((o) => o === oemAddr)).true;
  });

  it('createProxyBatch should create 10 proxies', async () => {
    const serials = new Array(10).fill(0).map((v, i) => i.toString());
    const proxies = await pm.createProxyBatch(serials);

    const createdSerials = await mapProxiesBy(
      proxies,
      (p) => p.serial(),
    );
    expect(createdSerials).to.be.equalTo(serials);
  });

  it('should return list of all proxies', async () => {
    await pm.connect(oem).createProxyBatch(['1', '2']);
    await pm.connect(installer).createProxyBatch(['3', '4']);

    expect(
      await mapProxiesBy(await pm.allProxies(), async (p) => p.serial()),
    )
      .to.be.equalTo(['1', '2', '3', '4']);
  });

  it('should list created tokens', async () => {
    await pm.connect(oem).createProxyBatch([id1, id2]);
    await pm.connect(installer).createProxyBatch([id3, id4]);

    expect(await mapProxiesBy(
      await pm.proxiesOwnedBy(await oem.getAddress()),
      (p) => p.serial(),
    ))
      .to.be.equalTo([id1, id2]);
    expect(await mapProxiesBy(
      await pm.proxiesOwnedBy(await installer.getAddress()),
      (p) => p.serial(),
    ))
      .to.be.equalTo([id3, id4]);
  });

  it('owner can be changed', async () => {
    await pm.connect(oem).createProxyBatch([id1, id2]);
    await pm.connect(installer).createProxyBatch([id3, id4]);

    await pm.connect(oem).changeOwner(id1, await installer.getAddress());

    expect(await mapProxiesBy(
      await pm.proxiesOwnedBy(await installer.getAddress()),
      (p) => p.serial(),
    ))
      .to.be.equalTo([id1, id3, id4]);
    expect(await (await pm.proxyById(id2)).owner()).equal(await oem.getAddress());
  });

  it('owner can be changed batched', async () => {
    await pm.connect(oem).createProxyBatch([id1, id2]);
    await pm.connect(installer).createProxyBatch([id3, id4]);

    await pm.connect(oem).changeOwnerBatch([id1, id2], await installer.getAddress());
    expect(await mapProxiesBy(
      await pm.proxiesOwnedBy(await installer.getAddress()),
      (p) => p.serial(),
    ))
      .to.be.equalTo([id1, id2, id3, id4]);
    expect(await mapProxiesBy(
      await pm.proxiesCreatedBy(await oem.getAddress()),
      (p) => p.serial(),
    ))
      .to.be.equalTo([id1, id2]);
  });

  it('should update metadata uri', async () => {
    const device = await pm.createProxy('1');
    const exampleUri = 'https://example.com';

    expect(await device.uri()).equal('');

    await device.updateUri(exampleUri);

    expect(await device.uri()).equal(exampleUri);
  });
});
