# EW DID Library v0.1
## Disclaimer
> The EW-DID library is not ready for production grade applications.
## Introduction
The EW-DID library implementation confirms to the requirements specified in the [DID Specification](https://w3c.github.io/did-core/) published by the W3C Credential Community Group. The aim of the library is to : 
- provide an abstraction layer to manage and interact with DIDs and Verifiable Claims on Energy Web Chain
- enable EW Member organisation to adopt or/and implement different DID methods

## EW DID Packages
### Description

| Package                                                                       | Description                                               |
|:---                                                                           |:---                                                       | 
| [`@energyweb/ew-did-registry/did-registry`](/packages/did-registry)           | entry-point package for end-users.                        |
| [`@energyweb/ew-did-registry/did-document`](/packages/did-document)           | exposes CRUD operations for DID Documents that are based on DID W3C Specification. Main class is an abstract factory that allows to work with lite or full implementations of CRUD.                             |
| [`@energyweb/ew-did-registry/did-ethr-resolver`](/packages/did-ethr-resolver) | connects did-document’s CRUD methods with a particular blockchain implementation of DID specification.                                                                                                        |
| [`@energyweb/ew-did-registry/did-interface-resolver`](/packages/did-resolver-interface) | provides an interface to implement DID method.                                                                                                        |
| [`@energyweb/ew-did-registry/claims`](/packages/claims)                       | manages Public, Private and Proof claims.                 |
| [`@energyweb/ew-did-registry/keys`](/packages/keys)                           | provides key management and asymmetric cryptography.      |
| [`@energyweb/ew-did-registry/jwt`](/packages/jwt)                             | exposes methods to sign, verify, encode, and decode JWTs. |

### Package Diagram
![](https://i.imgur.com/8oKqao9.jpg)

## Using EW DID
### Setup
#### Install root dependencies
```shell
npm install
```
#### Install dependencies and link packages
```shell
npm run setup
```
#### Compile packages
```shell
npm run build
```

### Test
```bash
npm run test-rpc
```

## Design Goals
The (other) ongoing [Decentralised Identities implementation](https://w3c-ccg.github.io/did-method-registry/) are only supporting a single DID method. The DLT/Blockchain specific DID method implementations are still evolving. Application developers might find different DID methods relevant to their application needs. With the help of EW DID, we are trying to standardise the interaction with DIDs while offering a variety of underlying DID method implementations by EWF Members. EW DID library aims to have reusable components related to DID operations and to reduce the development efforts associated with using DID in dApps. There are three design goals for the EW DID library:
1. Implementing the W3C's DID V1.0 specification
2. Adhering to the W3C's VC specification
3. Ability to implement support for different DID methods on EWC 

## Decentralised Identifiers (DID)
Decentralized Identifiers (DIDs) are a new type of identifier for verifiable, decentralized digital identity. These new identifiers are designed to enable the controller of a DID to prove control over it and to be implemented independently of any centralized registry, identity provider, or certificate authority. DIDs are URLs that relate a DID subject to means for trustable interactions with that subject. DIDs resolve to DID Documents — simple documents that describe how to use that specific DID. Each DID Document may express cryptographic material, verification methods, and/or service endpoints. These provide a set of mechanisms which enable a DID controller to prove control of the DID. Service endpoints enable trusted interactions with the DID subject.

## EW DID Scheme
### Format
EW DID utilizes the identifier format defined in [DID Specification](https://https://w3c.github.io/did-core/#did-syntax). The ABNF definition for EW DID identifier has the following syntax:
```typescript
did                = "did:" method ":" specific-idstring ;
method             = "ethr"
specific-idstring  = idstring *( ":" idstring ) ;
idstring           = BASE16;
```
EW DID for `ethr` method example:
```
did:ethr:0xD845B41AB4837E06Aa7335E31D98c9097a064891
```

> Currently EW DID identifier syntax does not encode the network string(e.g. ewc, volta) in the syntax. Network should be configured as show in the following [section](#Setting-up-the-network-and-method-configuration).

### Setting up the network and method configuration
In order EW-DID to perform different DID operations, the resolver needs to be aware of the connection provider to Energy Web network and address of DID registry contract. This can be done by configuring the IResolverSettings instance.

The first implemented resolver is for the [ERC-1056](https://github.com/ethereum/EIPs/issues/1056) specification. In this example we use the ERC-1056 [Identity registry smart contract](https://github.com/uport-project/ethr-did-registry/blob/develop/contracts/EthereumDIDRegistry.sol) deployed on the Volta test net to read and write DID attributes.

```typescript
import { address1056, abi1056, ProviderTypes, IResolverSettings, Resolver, IServiceEndpoint } from 'ew-did-registry/packages/did-ethr-resolver';

const NETWORK_URL = 'https://volta-rpc.energyweb.org/';

const provider = {
  uriOrInfo: ${NETWORK_URL},
  type: ProviderTypes.HTTP,
};

// construct the IResolverSettings
const resolverSettings: IResolverSettings = {
  provider,
  abi: abi1056,
  address: address1056
};

// perform a read only operation on given user did
const userDid = 'did:ethr:0xD845B41AB4837E06Aa7335E31D98c9097a064891';
const document = new DIDDocumentLite(userDid, new Resolver(resolverSettings));
```
## DID Document
A DID can be resolved to a [DID document](https://w3c.github.io/did-core/#did-documents) with help of a resolver. The DID document is a [JSON-LD](https://json-ld.org/) object which can be constructed by retrieving the attributes that describes:
- owner of the DID
- list of valid cryptographic keys
- list of ways that can be used to authenticate 
- list of service endpoints associated with the DID
Example:
```xml
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdefghi",
  "authentication": [{
    //used to authenticate as did ...fghi
    "id": "did:example:123456789abcdefghi#keys-1",
    "type": "RsaVerificationKey2018",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyPem": "-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n"
  }],
  "service": [{
    // used to retrieve Verifiable Credentials associated with the DID
    "id":"did:example:123456789abcdefghi#vcs",
    "type": "VerifiableCredentialService",
    "serviceEndpoint": "https://example.com/vc/"
  }]
}
```
## DID-Registry Package
DID Registry package wraps the different functionality around the DID and serves as a single point of entry to manage DID and claims lifecycle.

* **Instantiate DID Registry**
```typescript
const userKeys = new Keys({
    privateKey: '813e864ffa199f3cd38d8dcf2b097a2e2b226e000f3a05267eee23d0da7086f4',
    publicKey: '029462cf4b9ece1f84b600e3d924641aa359f068f1876cbf08b1b345e4c9831f23',
  });
  
const userDid = 'did:ethr:0x7551eD4be4eFd75E602189E9d59af448A564AB3a';

//initialise the DIDRegistry with keys and a configured Resolver instance
const didReg = new DIDRegistry(userKeys, userDid, new Resolver(resolverSettings));

// create a claimsCreator for User
const userClaims = didReg.claims.createClaimsUser();

//construct the claim payload for public claim
const claimData = {
      name: 'Tesla Model 3',
      capacity: '10',
      price: '500',
    }; 

// create a signed claim token with claim payload/data
const claimToken = await userClaims.createPublicClaim(claimData);
```

## DID-DOCUMENT Package
The did-document package functionality is in line with did-reg package. The Interfaces provides the client with a factory to create DID Document objects, which in turn expose DID CRUD operations in the full version, as well as read operations for lite version. Interfaces are created by conforming to [W3C DIDs v1.0](https://w3c.github.io/did-core/) standard.
The goal of the [Resolver](https://github.com/energywebfoundation/ew-did-registry/blob/development/packages/did-resolver-interface/src/interface.ts) interface is to provide flexibility to the user to define his own implementation of the Resolver for the required DID method on Energy Web chain. Currently the 1056 [Operator](https://github.com/energywebfoundation/ew-did-registry/blob/development/packages/did-ethr-resolver/src/implementations/operator.ts) implements the CRUD behaviour required for `ethr` DID method which is based on ERC1056 standard.
### Create
To create a DID,
```typescript
const ownerAddress = '0xed6011BBaB3B98cF955ff271F52B12B94BF9fD28';
const did = `did:ethr:${ownerAddress}`;

const keys = new Keys({
    privateKey: '0b4e103fe261142b716fc5c055edf1e70d4665080395dbe5992af03235f9e511',
    publicKey: '02963497c702612b675707c0757e82b93df912261cd06f6a51e6c5419ac1aa9bcc',
  });

///instantiate the operator with configured Resolver Settings
const operator = new Operator(keys, resolverSettings);

//create the DIDDocumentFull instance
const document = new DIDDocumentFull(did, operator);

// For the 1056 implementation this will only add public key the user's DID Document. There is no blockchain transaction involved
const created = await document.create();
```
### Read
Using the EW DID resolver we can read the whole DID document. You can read specific attribute using the DIDDocument instance.
#### Fetching the whole DID Document 
```typescript
import { Resolver } from '@ew-did-registry/did-ethr-resolver';

// did of the user
const did = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';

// Read the whole document 
const document: IDidDocument = Resolver.read(did);

// Check whether it's a valid DID document 
```
#### Reading an attribute
```typescript

const didDocumentLite: IDIDDocumentLite;

// initialise the DIDDocument instance with configured resolver
didDocumentLite = new DIDDocumentLite(did, resolver);

//read the public key of the user from DID document
const publicKey = await didDocumentLite.read(Attributes.publicKey, 'Secp256k1VerificationKey');

```

### Update
#### Adding a valid public key for verfication.
```typescript
// add an attribute to DID Document of the user
const updated = await document.update(
  DIDAttribute.PublicKey,
  {
    type: PubKeyType.VerificationKey2018,
    algo: Algorithms.ED25519,
    encoding: Encoding.HEX,
    value: new Keys().publicKey,
  },
  validity,
);
```
#### Adding an authentication method
```typescript=
const delegate = new Wallet(new Keys().privateKey);

const updated = await document.update(
  DIDAttribute.Authenticate,
  {
    type: PubKeyType.SignatureAuthentication2018,
    algo: Algorithms.ED25519,
    encoding: Encoding.HEX,
    delegate: delegate.address,
  },
  validity,
);
```
#### Adding a service endpoint for a claim
```typescript
// serviceEndPoint of the claim to be added
const endpoint = 'https://claimstore.energyweb.org/gba42asdf';

//add the service endpoint
const updated = await document.update(
  DIDAttribute.ServicePoint,
  {
    type: PubKeyType.VerificationKey2018,
    value: endpoint,
  },
  validity,
);
```
### Delete/Revoke
> Currently revocation functionality exposed only through IOperator interface. In future, it will available through the IDIDDocument interface
#### Revocation of the public key
```typescript
//publicKey to be revoked
const attribute = DIDAttribute.PublicKey;

const updateData: IUpdateData = {
      algo: Algorithms.ED25519,
      type: PubKeyType.VerificationKey2018,
      encoding: Encoding.HEX,
      value: keysAttribute.publicKey,
    };
const revoked = await operator.revokeAttribute(did, attribute, updateData);
```
#### Revocation of the authentication method
```typescript
//authentication method to be Revoked
const delegateDid = `did:ewc:${delegate.address}`;

//revoke the authentication method
const revoked = await operator.revokeDelegate(did, PubKeyType.VerificationKey2018, delegateDid);
```
#### Revocation of the service point
```typescript
//serviceEndpoint to be revoked
const endpoint = 'https://claimstore.energyweb.org/gba42asdf';

const revoked = await operator.revokeAttribute(
    did, 
    DIDAttribute.ServicePoint,
   {
    type: PubKeyType.VerificationKey2018,
    value: endpoint,
  }
);
```
#### Revoking all attributes
```typescript
// revokes attributes related to authentication and service endpoints
const deactivated = await document.deactivate();
```
## Resolver Package
### 1056 Resolver
Resolver is the implementation of ERC1056 standard. It only exposes the Read functionality of the DID document. The class is implemented with caching. Recurring calls will execute 
significantly faster.
> The design goal of EW DID is to support different DID methods on Energy Web Chain. The resolver currently has the support for ERC1056 standard (`ethr` DID method). In future, we will have support for ERC725 standard which enables `erc725` DID method.

* **Importing required modules**

``` typescript
import { Resolver, DelegateTypes } from '@ew-did-registry/did-ethr-resolver';
```

* **Reading the DID Document for particular id**

``` typescript  
    const resolver = new Resolver(resolverSettings);
    const did = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDocument = await resolver.read(did);
```

* **Reading the current owner of the did**

This method doesn't require full document fetching.
Returns did of the current owner.
``` typescript
    const did = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const owner = await resolver.identityOwner(did);
```

* **Checking if delegate is present in the DID Document**

This read doesn't require full document fetching.
Returns boolean if the delegate is present.
``` typescript
    const did = 'did:ethr:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
    const didDelegate = 'did:ewc:0xe2e457aods7BEd9AbdEE9410xt985E46e28a3947';
    const validDelegate = await resolver.validDelegate(did, DelegateTypes.verification, didDelegate);
```
## Claims Package
The claims package provides an interface to manage public and private claims in a straightforward manner. It abstracts the claim lifecycle, that currently consists of the following stages:
* creation and issuance of public and private claims
* creation of proofs for the issued claims and verification thereof

### Public Claims
* **Importing required modules**

``` typescript
import {
  IResolver, IOperator, DIDAttribute, IUpdateData, PubKeyType, Algorithms, Encoding,
} from '@ew-did-registry/did-resolver-interface';
import { Keys } from '@ew-did-registry/keys';
import { Methods } from '@ew-did-registry/did';
import { IClaim } from '@ew-did-registry/claims';
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import DIDRegistry from '@ew-did-registry/did-registry';
```

* **Creating identities based on their roles**
  
User is the claims subject

``` typescript
  const userKeys = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const userAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const userDid = `did:${Methods.Erc1056}:${userAddress}` ;
```  
`Operator` - is an interface responsible for DID document updating
```typescript 
  const userOperator = new Operator(userKeys, resolverSettings);
```
Before using DID document it needs to be initialized. During initialization, 
the document stores the user's public key associated with its etherum address 
``` typescript
  await userOperator.create();
```
```DIDRegistry``` - main interface for working with claims and DID documents
``` typescript
  const user = new DIDRegistry(userKeys, userDid, new Resolver(resolverSettings));
```
Claims creator is represented by ```IClaimsUser```
```typescript 
  const userClaims: IClaimsUser = user.claims.createClaimsUser();
```  
Same flow for issuer. Issuer checks claim data and issue token, which can be 
stored and verified
```typescript 
  const issuerKeys = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263',
  }); 
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B'; 
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}` ; 
  const issuer = new DIDRegistry(issuerKeys, issuerDid, new Resolver(resolverSettings)); 
  const issuerClaims = issuer.claims.createClaimsIssuer();
```
Same flow for verifier
```typescript 
  const verifierKeys = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  }); 
  const verifierAddress = '0x6C30b191A96EeE014Eb06227D50e9FB3CeAbeafd'; 
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}` ; 
  const verifier = new DIDRegistry(verifierKeys, verifierDid, new Resolver(resolverSettings)); 
```
The time interval during which the corresponding record in the DID document will
be valid
```typescript 
  const validity = 5 * 60 * 1000;
```
* **Claim creation**
```typescript 
  const claimData = {
      name: 'Tesla Model 3',
      capacity: '10',
      price: '500',
    }; 
    const token = await userClaims.createPublicClaim(claimData);
```
* **Claim issuance**
```typescript 
  const issuedToken = await issuerClaims.issuePublicClaim(token);
```
* **Verification of issued claim and adding issuer to delegates**

'verifyPublicClaim' check if the claim has the correct payload and
also adds delegate to the smart contract
```typescript 
  const verified = await userClaims.verifyPublicClaim(issuedToken); 
  expect(verified).is.true;
  };
```

* **Verifier checks if the presented token is valid**

'verifyPublicProof' checks the signature on the claim, as well as 
whether the delegate is valid for the DID
```typescript 
  const verified = await claimsUser.verifyPublicProof(issuedToken);
  expect(verified).to.be.true;
```

An ```IDIDDocumetLite``` interface is used to read a document
```typescript 
  const userLigthDoc: IDIDDocument = user.documentFactory.createLite(new Resolver(resolverSettings)); 
  await userLigthDoc.read(userDid); 
  let document = userLigthDoc.didDocument;
```

An ```IDIDDocumetFull``` interface is used to update a document
```typscript
  const userFullDoc: IDIDDocumentFull = user.documentFactory.createFull(new Operator(userKeys)); 
  expect(userFullDoc).instanceOf(DIDDocumentFull);
  await userFullDoc.update(DIDAttribute.Authenticate, updateData, validity); 
});
```
### Private Claims
* **Importing required modules**

``` typescript
  import { expect } from 'chai';
  import {
    Resolver, Operator, DIDAttribute, IUpdateData, PubKeyType, Algorithms, Encoding
  } from '@ew-did-registry/did-resolver-interface';
  import { Keys } from '@ew-did-registry/keys';
  import { Methods } from '@ew-did-registry/did';
  import { IClaim } from '@ew-did-registry/claims';
  import { DIDDocumentFull } from '@ew-did-registry/did-document';
  import DIDRegistry from '@ew-did-registry/did-registry';
```
* **Creating identities based on their roles**

User is the claims subject
``` typescript
  const userKeys = new Keys({
    privateKey: '42f9eb48de908412da91f0e7b6d8f987db91cbf7bf2639c53394b746d91d2382',
    publicKey: '0391feb03b9fadd2dfb9dfe7d3c53cd4a64094bd7ffd19beb8c46efbeaf2724f32',
  });
  const userAddress = '0xE7804Cf7c346E76D3BA88da639F3c15c2b2AE4a5';
  const userDid = `did:${Methods.Erc1056}:${userAddress}` ;
```
```Operator``` - an interface responsible for DID document updating
``` typescript
  const userOperator = new Operator(userKeys);
```
Before using DID document it needs to be initialized. During initialization, 
the document stores the user's public key associated with its Etherum address. 
Each document update costs a Volts, therefore make sure that there are enough 
funds on the account
``` typescript
  await userOperator.create();
```
```DIDRegistry``` - main interface for working with claims and DID documents
``` typescript
  const user = new DIDRegistry(userKeys, userDid, new Resolver(resolverSettings));
```
Claims creator is represented by ```IClaimsUser```
```typescript 
  const userClaims: IClaimsUser = user.claims.createClaimsUser();
```  
Same flow for issuer. Issuer checks claim data and issue token, which can be 
stored and verified
```typescript 
  const issuerKeys = new Keys({
    privateKey: '945d90baf66123693be97edff663d5c54f5d517d40928a9c0caa37dba3a0b042',
    publicKey: '0232c391f52ff6c63e1ffdfa6921822aee895d2a21bb28a71370404b05960c9263,
  }); 
  const issuerAddress = '0xddCe879DE01391176a8527681f63A7D3FCA2901B'; 
  const issuerDid = `did:${Methods.Erc1056}:${issuerAddress}` ; 
  const issuer = new DIDRegistry(issuerKeys, issuerDid, new Resolver(resolverSettings)); 
  const issuerClaims = issuer.claims.createClaimsIssuer();
```
Same flow for verifier
```typescript 
  const verifierKeys = new Keys({
    privateKey: '37cd773efb8cd99b0f509ec118df8e9c6d6e5e22b214012a76be215f77250b9e',
    publicKey: '02335325b9d16aa046ea7275537d9aced84ed3683a7969db5f836b0e6d62770d1e',
  }); 
  const verifierAddress = '0x6C30b191A96EeE014Eb06227D50e9FB3CeAbeafd'; 
  const verifierDid = `did:${Methods.Erc1056}:${verifierAddress}` ; 
  const verifier = new DIDRegistry(verifierKeys, verifierDid, new Resolver(resolverSettings));
```
The time interval during which the corresponding record in the DID document will
be valid. Validity is stored in milliseconds, hence 5 minutes are represented in 
the example below
```typescript 
  const validity = 5 * 60 * 1000;
```
* **Claim creation**
```typescript 
  const claimData = {
    secret: '123',
    notSecret: 'string',
  };
  const { token, saltedFields } = await userClaims.createPrivateClaim(claimData, issuerDid);
```
Private claim will contain private user data encoded with issuer key. Salted 
fields will be used to verify issued claim and to create proof claim

* **Claim issuance**

Issuer encodes private user data and then hashes it
```typescript 
  const issuedToken = await issuerClaims.issuePrivateClaim(token);
```

* **Verification of issued claim and adding issuer to delegates**

```typescript 
  const verified = await userClaims.verifyPrivateClaim(issuedToken, saltedFields); 
  expect(verified).is.true;
  const claim: IClaim = userClaims.jwt.decode(issuedToken) as IClaim; 
  expect(claim.did).equal(userDid); 
  expect(claim.signer).equal(issuerDid); 
  expect(claim.claimData).deep.equal(claimData); 
  const updateData: IUpdateData = {
    algo: Algorithms.Secp256k1,
    type: PubKeyType.VerificationKey2018,
    encoding: Encoding.HEX,
    delegate: issuerAddress,
  };
```

An ```IDIDDocumetLite``` interface is used to read a document
```typescript 
  const userLigthDoc: IDIDDocument = user.documentFactory.createLite(new Resolver(resolverSettings)); 
  await userLigthDoc.read(userDid); 
  let document = userLigthDoc.didDocument;
```
An ```IDIDDocumetFull``` interface is used to update a document
```typescript 
  const userFullDoc: IDIDDocumentFull = user.documentFactory.createFull(new Operator(userKeys)); 
  expect(userFullDoc).instanceOf(DIDDocumentFull);
  await userFullDoc.update(DIDAttribute.Authenticate, updateData, validity); 
  await userLigthDoc.read(userDid);
  document = userLigthDoc.didDocument;
  const expectedPkId = `${userDid}#delegate-${PubKeyType.VerificationKey2018}-${issuerAddress}`;
  expect(document.publicKey.find((pk) => pk.id === expectedPkId)).to.not.undefined;
```
Application saves issued token

* **User proves his ownership of private data**

```typescript 
  const claimUrl = 'http://test.service.com';
  const encryptedSaltedFields: IProofData = {};
  let counter = 0;
  Object.entries(saltedFields).forEach(([key, value]) => {
    if (counter % 2 === 0) {
      encryptedSaltedFields[key] = {
        value,
        encrypted: true,
      };
    } else {
      encryptedSaltedFields[key] = {
        value,
        encrypted: false,
      };
    }
    // eslint-disable-next-line no-plusplus
    counter++;
  });
  const proofToken = await userClaims.createProofClaim(claimUrl, encryptedSaltedFields);
```
Application loads issued token from claimUrl = 'http://claim.url' and 
cryptographycally matches it with proof token
```typescript 
  verified = await verifier.claims.createClaimsVerifier().verifyPrivateProof(proofToken, issuedToken);
  expect(verified).is.true;
```
## Keys Package
The keys package provides a clean and simple interface for the client and expose cryptographic operations based on asymmetric cryptography for secp256k1 ECDSA.
```typescript
// If you don't have a key pair you can generate new Key Pair
const keys = Keys.generateKeyPair(); // builder

// If you have a private key you can instantiate the Keys with private key
const keys = new Keys({ privateKey: keys.privateKey });

// If you have a public key you can Instantiate the Keys with public key
const keys = new Keys({ publicKey: keys.publicKey });

// Sign and verify data. 
const data = "test";
const signature = keys.sign(data); // Doesn't work if you initiate the Keys with public key.
console.log(keys.verify(data, signature)); // true
```

## JWT Package
The JWT package is internally consumed by the Claims package to perform necessary operations on JWTs.
```typescript
// Initiate the JWT implementation
const jwt = new IJWT(keyPair);

// Provide digitally signed JWT using ECDSA using P-256 curve and SHA-256 hash algorithm
// Various options can be specified, including Token expiration
// Returns encdoded token
try {
  const token = await jwt.sign(payload, { algorithm: 'ES256' });
} catch(e) {
  console.log(e);
}

// Siganture verification; options can be specified 
// Returns decoded payload, if signature is valid. Throws error otherwise
try {
  const decoded = await jwt.verify(token, publicKey);
} catch(e) {
  console.log(e);
}

// Decoding JWT without verifying the signature. This is require to retrieve DID of the subject
// Returns decoded object, which consists of header and payload
// If "complete" option is default(false), only payload is returned
// "json" options forces JSON.parse on the payload even if the header doesn't contain "typ":"JWT"
const decoded = jwt.decode(token, {complete: true});
console.log(decoded.header);
console.log(decoded.payload.did);
```
## DID Resolver Interface
EW-DID library has a design goal to support different DID methods. `did-document` allows management of keys, authorisation, delegation and service endpoints in standardised way. In the practical scenario, the CRUD behaviour of the `did-document` needs to be specific to the DID method's underlying implementation. EW-DID aims to handle this through the DID method specific resolver implementation. 

`did-resolver-interface` defines the contract required for CRUD behaviour of the `did-document`. [did-ethr-resolver](/packages/did-ethr-resolver) provides a reference implementation of ERC 1056 standard.

### Class Diagram

[![](https://mermaid.ink/img/eyJjb2RlIjoiY2xhc3NEaWFncmFtXG5cbmNsYXNzIElSZXNvbHZlcntcbiAgICA8PGludGVyZmFjZT4-XG4gICAgcmVhZCgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5jbGFzcyBJT3BlcmF0b3J7XG4gICAgPDxpbnRlcmZhY2U-PlxuICAgIGNyZWF0ZSgpXG4gICAgdXBkYXRlKClcbiAgICBkZWFjdGl2YXRlKClcbiAgICByZXZva2VEZWxlZ2F0ZSgpXG4gICAgcmV2b2tlQXR0cmlidXRlKClcbn1cblxuY2xhc3MgRVJDMTA1NlxuXG5jbGFzcyBFUkMxMDU2T3BlcmF0b3JcblxuY2xhc3MgRVJDNzI1XG5cbmNsYXNzIEVSQzcyNU9wZXJhdG9yXG5cbmNsYXNzIE15TmV3TWV0aG9kXG5jbGFzcyBNeU5ld01ldGhvZE9wZXJhdG9yXG5JUmVzb2x2ZXIgPHwtLSBJT3BlcmF0b3JcblxuSU9wZXJhdG9yIDx8Li4gRVJDMTA1Nk9wZXJhdG9yXG5JT3BlcmF0b3IgPHwuLiBFUkM3MjVPcGVyYXRvclxuSU9wZXJhdG9yIDx8Li4gTXlOZXdNZXRob2RPcGVyYXRvclxuXG5JUmVzb2x2ZXIgPHwuLiBFUkMxMDU2XG5JUmVzb2x2ZXIgPHwuLiBFUkM3MjVcbklSZXNvbHZlciA8fC4uIE15TmV3TWV0aG9kXG5cbkVSQzEwNTYgPHwtLSBFUkMxMDU2T3BlcmF0b3JcbkVSQzcyNSA8fC0tIEVSQzcyNU9wZXJhdG9yXG5NeU5ld01ldGhvZCA8fC0tIE15TmV3TWV0aG9kT3BlcmF0b3JcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In19)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiY2xhc3NEaWFncmFtXG5cbmNsYXNzIElSZXNvbHZlcntcbiAgICA8PGludGVyZmFjZT4-XG4gICAgcmVhZCgpXG4gICAgcmV2b2tlRGVsZWdhdGUoKVxuICAgIHJldm9rZUF0dHJpYnV0ZSgpXG59XG5jbGFzcyBJT3BlcmF0b3J7XG4gICAgPDxpbnRlcmZhY2U-PlxuICAgIGNyZWF0ZSgpXG4gICAgdXBkYXRlKClcbiAgICBkZWFjdGl2YXRlKClcbiAgICByZXZva2VEZWxlZ2F0ZSgpXG4gICAgcmV2b2tlQXR0cmlidXRlKClcbn1cblxuY2xhc3MgRVJDMTA1NlxuXG5jbGFzcyBFUkMxMDU2T3BlcmF0b3JcblxuY2xhc3MgRVJDNzI1XG5cbmNsYXNzIEVSQzcyNU9wZXJhdG9yXG5cbmNsYXNzIE15TmV3TWV0aG9kXG5jbGFzcyBNeU5ld01ldGhvZE9wZXJhdG9yXG5JUmVzb2x2ZXIgPHwtLSBJT3BlcmF0b3JcblxuSU9wZXJhdG9yIDx8Li4gRVJDMTA1Nk9wZXJhdG9yXG5JT3BlcmF0b3IgPHwuLiBFUkM3MjVPcGVyYXRvclxuSU9wZXJhdG9yIDx8Li4gTXlOZXdNZXRob2RPcGVyYXRvclxuXG5JUmVzb2x2ZXIgPHwuLiBFUkMxMDU2XG5JUmVzb2x2ZXIgPHwuLiBFUkM3MjVcbklSZXNvbHZlciA8fC4uIE15TmV3TWV0aG9kXG5cbkVSQzEwNTYgPHwtLSBFUkMxMDU2T3BlcmF0b3JcbkVSQzcyNSA8fC0tIEVSQzcyNU9wZXJhdG9yXG5NeU5ld01ldGhvZCA8fC0tIE15TmV3TWV0aG9kT3BlcmF0b3JcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In19)

### Pseudo example of implementation
```typescript
// MyResolver - Implement the read only behaviour for your DID Method
class Resolver implements IResolver{
        
    read(){
    // return the whole DID Document
    }
    
    readAttribute(){
    // read an attribute as per did method requirement 
    }
    
    valiDelegate(){
    //validate a delegate as per did method requirement
    }

}

// MyResolver - Implement the update and revoke behaviour for your DID Method
class Operator extends Resolver implements IOperator {

    create(){
    //create specific to did method
    }

    update(){
    //update specific to did method
    }
    deactivate(){
    //deactivate specific to did method
    }
    revokeDelegate(){
    //revokeDelegate specific to did method
    }
    
    revokeAttribute(){
    //revoke attribute specific to did method
    }

}
```
## Future Work
>
