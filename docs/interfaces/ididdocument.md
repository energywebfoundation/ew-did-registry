[@ew-did-registry/did](../README.md) › [Globals](../globals.md) › [IDIDDocument](ididdocument.md)

# Interface: IDIDDocument

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

Defined in did-resolver/src/models/resolver.ts:59

___

###  authentication

• **authentication**: *Array‹[IAuthentication](iauthentication.md) | string›*

Defined in did-resolver/src/models/resolver.ts:62

___

### `Optional` created

• **created**? : *string*

Defined in did-resolver/src/models/resolver.ts:65

___

### `Optional` delegates

• **delegates**? : *string[]*

Defined in did-resolver/src/models/resolver.ts:63

___

###  id

• **id**: *string*

Defined in did-resolver/src/models/resolver.ts:60

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

Defined in did-resolver/src/models/resolver.ts:67

___

###  publicKey

• **publicKey**: *[IPublicKey](ipublickey.md)[]*

Defined in did-resolver/src/models/resolver.ts:61

___

### `Optional` service

• **service**? : *[IServiceEndpoint](iserviceendpoint.md)[]*

Defined in did-resolver/src/models/resolver.ts:64

___

### `Optional` updated

• **updated**? : *string*

Defined in did-resolver/src/models/resolver.ts:66
