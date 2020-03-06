[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDDocument](ididdocument.md)

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

*Defined in [did-resolver/src/models/resolver.ts:41](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L41)*

___

###  authentication

• **authentication**: *Array‹[IAuthentication](iauthentication.md) | string›*

*Defined in [did-resolver/src/models/resolver.ts:44](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L44)*

___

### `Optional` created

• **created**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:47](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L47)*

___

### `Optional` delegates

• **delegates**? : *string[]*

*Defined in [did-resolver/src/models/resolver.ts:45](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L45)*

___

###  id

• **id**: *string*

*Defined in [did-resolver/src/models/resolver.ts:42](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L42)*

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

*Defined in [did-resolver/src/models/resolver.ts:49](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L49)*

___

###  publicKey

• **publicKey**: *[IPublicKey](ipublickey.md)[]*

*Defined in [did-resolver/src/models/resolver.ts:43](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L43)*

___

### `Optional` service

• **service**? : *[IServiceEndpoint](iserviceendpoint.md)[]*

*Defined in [did-resolver/src/models/resolver.ts:46](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L46)*

___

### `Optional` updated

• **updated**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:48](https://github.com/energywebfoundation/ew-did-registry/blob/9ddd7ca/packages/did-resolver/src/models/resolver.ts#L48)*
