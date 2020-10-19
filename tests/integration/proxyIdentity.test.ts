import { JsonRpcProvider } from 'ethers/providers';
import { ContractFactory, Contract } from 'ethers';
import { expect } from 'chai';

import {
  erc1056Build, createProxy, proxyFactoryBuild, multiproxyBuild,
} from '../../packages/proxyIdentity/src';
import {
  IClaimsUser, ClaimsUser,
} from '../../packages/did-registry/node_modules/@ew-did-registry/claims/src';
import { DIDDocumentFull } from '../../packages/claims/node_modules/@ew-did-registry/did-document/src';
import { Methods } from '../../packages/did-registry/node_modules/@ew-did-registry/did/src';
import { DidStore } from '../../packages/did-ipfs-store/src';
import { Operator } from '../../packages/did-ethr-resolver/src';

import { spawnIpfsDaemon, shutDownIpfsDaemon, getSettings } from '..';

const { abi: proxyFactoryAbi, bytecode: proxyFactoryBytecode } = proxyFactoryBuild;
const { ethrReg: { abi: erc1056Abi, bytecode: erc1056Bytecode } } = erc1056Build;
const { abi: multiProxyAbi, bytecode: multiProxyBytecode } = multiproxyBuild;

describe('Identities shared management with proxies', function () {
  this.timeout(0);

  const provider = new JsonRpcProvider('http://localhost:8544');

  const deployer = provider.getSigner(0);
  const bebat = provider.getSigner(1);
  const oem = provider.getSigner(2);
  const installer = provider.getSigner(3);
  const owner = provider.getSigner(4);

  let oemDid: string;
  let installerDid: string;
  let ownerDid: string;

  let erc1056: Contract;
  let erc1155: Contract;
  let proxyFactory: Contract;

  const uid = 1;
  let device: Contract;

  let store: DidStore;

  let oemClaims: IClaimsUser;
  let installerClaims: IClaimsUser;
  let ownerClaims: IClaimsUser;

  let installerDoc: DIDDocumentFull;
  let oemDoc: DIDDocumentFull;
  let ownerDoc: DIDDocumentFull;

  const claimData = {
    type: 'lithium',
    status: 'installed',
  };

  before(async () => {
    oemDid = `did:${Methods.Erc1056}:${await oem.getAddress()}`;
    installerDid = `did:${Methods.Erc1056}:${await installer.getAddress()}`;
    ownerDid = `did:${Methods.Erc1056}:${await owner.getAddress()}`;

    const erc1056Creator = new ContractFactory(erc1056Abi, erc1056Bytecode, deployer);
    erc1056 = await erc1056Creator.deploy();

    const erc1155Creator = new ContractFactory(multiProxyAbi, multiProxyBytecode, deployer);
    erc1155 = await erc1155Creator.deploy();

    const proxyFactoryCreator = new ContractFactory(proxyFactoryAbi, proxyFactoryBytecode, bebat);
    proxyFactory = await proxyFactoryCreator.deploy(erc1056.address, erc1155.address);

    store = new DidStore(await spawnIpfsDaemon());
    const resolverSettings = await getSettings([
      await oem.getAddress(), await installer.getAddress(), await owner.getAddress(),
    ]);

    oemDoc = new DIDDocumentFull(oemDid, new Operator(oem, resolverSettings));
    await oemDoc.create();

    installerDoc = new DIDDocumentFull(installerDid, new Operator(installer, resolverSettings));
    await installerDoc.create();

    ownerDoc = new DIDDocumentFull(ownerDid, new Operator(owner, resolverSettings));

    oemClaims = new ClaimsUser(oem, oemDoc, store);
    installerClaims = new ClaimsUser(installer, installerDoc, store);
    ownerClaims = new ClaimsUser(installer, ownerDoc, store);
  });

  it('BEBAT creates proxy identity and becomes its owner', async () => {
    device = await createProxy(proxyFactory, uid);
    expect(await device.owner()).equal(await bebat.getAddress());
    expect(
      parseInt(await erc1155.balanceOf(await bebat.getAddress(), uid), 16),
    )
      .equal(1);
  });

  it('BEBAT transfers ownership to OEM', async () => {
    await erc1155.connect(bebat).safeTransferFrom(await bebat.getAddress(), await oem.getAddress(), uid, 1, '0x0');
    expect(await device.owner()).equal(await oem.getAddress());
    expect(parseInt(await erc1155.balanceOf(await oem.getAddress(), uid), 16)).equal(1);
  });

  it('OEM updates Battery metadata', async () => {
    const uri = 'ipfs://123abc';
    await erc1155.connect(oem).updateUri(uid, uri);
    expect(await erc1155.uri(uid)).equal(uri);
  });

  it('OEM as the owner adds Installer to approved agents', async () => {
    await erc1155.connect(oem).setApprovalForAll(await installer.getAddress(), true);
    expect(
      await erc1155.isApprovedForAll(await oem.getAddress(), await installer.getAddress()),
    )
      .true;
  });

  it('Installer publishes self-issued claim', async () => {
    const claim = await installerClaims.createPublicClaim(claimData);

    const claimUrl = await installerClaims.publishPublicClaim(claim, claimData);

    expect(await store.get(claimUrl)).equal(claim);
  });

  it('Installer transfers ownership from OEM to asset owner', async () => {
    expect(await device.owner()).equal(await oem.getAddress());

    await erc1155.connect(installer).safeTransferFrom(await oem.getAddress(), await owner.getAddress(), uid, 1, '0x0');

    expect(await device.owner()).equal(await owner.getAddress());
  });

  after(async () => {
    await shutDownIpfsDaemon();
  });
});
