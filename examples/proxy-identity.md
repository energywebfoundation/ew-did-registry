# Ownership management with proxy identity

1. Creating identity and assigning its owner

``` typescript
  /** Manager allows to track state of all identities without having to subscribe to the events of each identity */
  const identityManagerFactory = new ContractFactory(IdentityManagerAbi, IdentityManagerBytecode, deployer);
  const manager = await identityManagerFactory.deploy();
  
  const identityFactory = new ContractFactory(identityAbi, identityBytecode, deployer);
  const identity = await identityFactory.deploy(ownerAddr, manager.address);
  
  expect(await identity.owner()).equal(ownerAddr);
```

2. Transferring identity

Identity cannot be transferred without the consent of the recipient

  + Offering

``` typescript
  const event = new Promise((resolve) => {
    manager.on('IdentityOffered', (offered, offeredTo) => {
      manager.removeAllListeners('IdentityOffered');
      resolve({ offered, offeredTo });
    });
  });
  
  await identity.connect(owner).functions.offer(receiverAddr);
  
  expect(await event).to.deep.equal({ offered: identity.address, offeredTo: receiverAddr });  
```

  + Acception (or rejection)

``` typescript
  const event = new Promise((resolve) => {
    manager.on('IdentityTransferred', (offered, offeredTo) => {
      manager.removeAllListeners('IdentityTransferred');
      resolve({ offered, offeredTo });
    });
  });

  await identity.connect(receiver).acceptOffer();
  
  expect(await identity.owner()).equal(receiverAddr);
  expect(await event).to.deep.equal({ offered: identity.address, offeredTo: receiverAddr });  
```

3. An identity having DID can be operated by its variation of Operator

``` typescript
  const operator = new OfferableIdenitytOperator(
      owner,
      { address: erc1056.address },
      identity.address,
    );
```

This allows the idenity owner to control the identity document

4. Owner can add service endpoint in identity document

``` typescript
  const attribute = DIDAttribute.ServicePoint;
    const endpoint = 'https://test.algo.com';
    const serviceId = 'UserClaimURL3';
    const updateData = {
      type: attribute,
      value: {
        id: `${did}#service-${serviceId}`,
        type: 'ClaimStore',
        serviceEndpoint: endpoint,
      },
    };
  await operator.update(did, attribute, updateData, validity);
```
