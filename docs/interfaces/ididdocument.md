[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDDocument](ididdocument.md)

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

Defined in did-resolver/src/models/resolver.ts:34

___

###  authentication

• **authentication**: *Array‹[IAuthentication](iauthentication.md) | string›*

Defined in did-resolver/src/models/resolver.ts:37

___

### `Optional` created

• **created**? : *string*

Defined in did-resolver/src/models/resolver.ts:40

___

### `Optional` delegates

• **delegates**? : *string[]*

Defined in did-resolver/src/models/resolver.ts:38

___

###  id

• **id**: *string*

Defined in did-resolver/src/models/resolver.ts:35

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

Defined in did-resolver/src/models/resolver.ts:42

___

###  publicKey

• **publicKey**: *[IPublicKey](ipublickey.md)[]*

Defined in did-resolver/src/models/resolver.ts:36

___

### `Optional` service

• **service**? : *[IServiceEndpoint](iserviceendpoint.md)[]*

Defined in did-resolver/src/models/resolver.ts:39

___

### `Optional` updated

• **updated**? : *string*

Defined in did-resolver/src/models/resolver.ts:41
