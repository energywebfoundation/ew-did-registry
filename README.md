# EW DID Library v0.1
## Disclaimer
> The EW-DID library is not ready for production grade applications.
## Introduction
The EW-DID library implementation confirms to the requirements specified in the [DID Specification](https://w3c.github.io/did-core/) published by the W3C Credential Community Group. The aim of the library is to : 
- provide an abstraction layer to manage and interact with DIDs and Verifiable Claims on Energy Web Chain
- enable EW Member organisation to adopt or/and implement different DID methods

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
A DID can be resolved to a [DID document](https://w3c.github.io/did-core/#did-documents) with help of a resolver. The DID document is a JSON-LD object which can be constructed by retrieving the attributes that describes:
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
## High Level Component Architecture
### Packages
* *did-registry* - entry-point package for end-users.
* *did* - works with DIDs: stores them and exposes getters and setters.
* *did-document* - exposes CRUD operations for DID Documents that are based on DID W3C Specification. Main class is an abstract factory that allows to work with lite or full implementations of CRUD.
* *resolver* - connects did-document’s CRUD methods with a particular blockchain implementation of DID specification.
* *keys* - package provides key management and asymmetric cryptography.
* *claims* - package manages Public, Private and Proof claims.
* *jwt* - package exposes methods to sign, verify, encode, and decode JWTs.

![](https://i.imgur.com/DE1g1wi.png)
