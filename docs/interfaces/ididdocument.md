[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IDIDDocument](ididdocument.md)

# Interface: IDIDDocument

The interface of DID Document is compliant with W3C specification.
https://w3c.github.io/did-core/
The link above will be the best point of reference for the interface below, including
IServiceEndpoint, IPublicKey, IAuthentication, ILinkedDataProof

## Hierarchy

* **IDIDDocument**

## Index

### Properties

* [@context](ididdocument.md#@context)
* [authentication](ididdocument.md#authentication)
* [created](ididdocument.md#optional-created)
* [delegates](ididdocument.md#optional-delegates)
* [id](ididdocument.md#id)
* [proof](ididdocument.md#optional-proof)
* [publicKey](ididdocument.md#publickey)
* [service](ididdocument.md#optional-service)
* [updated](ididdocument.md#optional-updated)

## Properties

###  @context

• **@context**: *string*

*Defined in [did-resolver/src/models/resolver.ts:46](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L46)*

___

###  authentication

• **authentication**: *Array‹[IAuthentication](iauthentication.md) | string›*

*Defined in [did-resolver/src/models/resolver.ts:49](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L49)*

___

### `Optional` created

• **created**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:52](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L52)*

___

### `Optional` delegates

• **delegates**? : *string[]*

*Defined in [did-resolver/src/models/resolver.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L50)*

___

###  id

• **id**: *string*

*Defined in [did-resolver/src/models/resolver.ts:47](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L47)*

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

*Defined in [did-resolver/src/models/resolver.ts:54](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L54)*

___

###  publicKey

• **publicKey**: *[IPublicKey](ipublickey.md)[]*

*Defined in [did-resolver/src/models/resolver.ts:48](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L48)*

___

### `Optional` service

• **service**? : *[IServiceEndpoint](iserviceendpoint.md)[]*

*Defined in [did-resolver/src/models/resolver.ts:51](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L51)*

___

### `Optional` updated

• **updated**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:53](https://github.com/energywebfoundation/ew-did-registry/blob/5e08895/packages/did-resolver/src/models/resolver.ts#L53)*
