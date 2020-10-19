# Ownership management with proxy identities

1. Organization creates proxy identity thus becoming its owner

``` typescript
  import {createProxy} from '@ew-did-registiry/proxyidentity';
  
  const proxyFactoryCreator = new ContractFactory(proxyFactoryAbi, proxyFactoryBytecode, bebat);
  const proxyFactory = await proxyFactoryCreator.deploy(erc1056.address, erc1155.address);
  
  const device = await createProxy(proxyFactory, uid);
  expect(await device.owner()).equal(await bebat.getAddress());
  expect(parseInt(await erc1155.balanceOf(await bebat.getAddress(), uid), 16)).equal(1);
```

2. Organization transfers ownership to OEM

``` typescript
  await erc1155.connect(bebat).safeTransferFrom(await bebat.getAddress(), await oem.getAddress(), uid, 1, '0x0');
  expect(await device.owner()).equal(await oem.getAddress());
  expect(parseInt(await erc1155.balanceOf(await oem.getAddress(), uid), 16)).equal(1);
```

3. OEM updates battery metadata

``` typescript
  expect(await erc1155.uri(uid)).equal('');
  
  const uri = 'ipfs://ipfs/123abc';
  await erc1155.connect(oem).updateUri(uid, uri);

  expect(await erc1155.uri(uid)).equal(uri);
```

4. OEM as the owner adds Installer to approved agents

``` typescript
  await erc1155.connect(oem).setApprovalForAll(await installer.getAddress(), true);
  expect(await erc1155.isApprovedForAll(await oem.getAddress(), await installer.getAddress())).true;
```

5. Installer publishes self-issued claim

``` typescript
  const claim = await installerClaims.createPublicClaim(claimData);

  const claimUrl = await installerClaims.publishPublicClaim(claim, claimData);

  expect(await store.get(claimUrl)).equal(claim);
```

6. Installer transfers ownership from OEM to asset owner

``` typescript
  expect(await device.owner()).equal(await oem.getAddress());

  await erc1155.connect(installer).safeTransferFrom(await oem.getAddress(), await owner.getAddress(), uid, 1, '0x0');

  expect(await device.owner()).equal(await owner.getAddress());
```
