# Proxy identity example

## Overview

**Proxy identity** - smart-contract enabling changing ownershish of his DID identity

## Example of use

Scenario:

1. OEM creates proxies of 4 devices thus becoming their owner. 

Owner can update proxie's document, can add and remove revocation agent and is proxie's delegate

``` typescript
import { ContractFactory, providers } from 'ethers';
import { createProxy } from '@ew-did-registry/proxyIdentity'; 
import { Methods } from '@ew-did-registry/did';

let oem: providers.JsonRpcSigner;
let installer: providers.JsonRpcSigner;

/* Deploying proxy factory from oem */
const proxyFactoryCreator = new ContractFactory(proxyFactoryAbi, proxyFactoryBytecode, oem); 
const factory = await (await proxyFactoryCreator.deploy(erc1056.address)).deployed(); 

 device1 = await createProxy(proxyFactory); 
 ...
 device4 = await createProxy(proxyFactory);
 ```

2. Installer creates claim about device and publishes it

``` typescript
// documents of all actors must be created
const installerClaims = new ClaimsUser(installerSigner, installerDoc, store);
const oemClaims = new ClaimsIssuer(oemSigner, oemDocument, store);
const verifierClaims = new ClaimsVerifier(verifierSigner, verifierDocument, store);

const claimData = {
  Model:'Tesla',
  SerialNo: 123456,
  Type: Lithium-Ion
}
const deviceDID = `did:${Methods.Erc1056}:${device1.address}` ;

const claim = await installerClaims.createPublicClaim(claimData, jwtOptions = { subject: deviceDID});

// OEM as the delegate of the claim subject can issue claim
const issuedClaim = await oemClaims.issuePublicClaim(claim);

// publishes claim in the store
const claimUrl = await installerClaims.publishPublicClaim(issuedClaim, claimData);

const verifiedClaim = await verifierClaims.verifyPublicProof(claimUrl); 
```

3. OEM transfers ownership of the devices to the installer

``` typescript
await device1.addRecoveryAgent(installerAddr); 
device1.connect(installer);
await device1.changeOwner(installerAddr); // oem also removed from revocation agents and delegates
    ...
```

From now on Installer can issue claim where subject is device1

4. Installer transfers ownership of devices to Asset owner

``` typescript
await device1.addRecoveryAgent(installerAddr); 
device1.connect(installer);
await device1.changeOwner(installerAddr); // oem also removed from revocation agents and delegates
    ...
```

 
 
