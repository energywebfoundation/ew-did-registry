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

Defined in did-resolver/src/models/resolver.ts:46

___

###  authentication

• **authentication**: *Array‹[IAuthentication](iauthentication.md) | string›*

Defined in did-resolver/src/models/resolver.ts:49

___

### `Optional` created

• **created**? : *string*

Defined in did-resolver/src/models/resolver.ts:52

___

### `Optional` delegates

• **delegates**? : *string[]*

Defined in did-resolver/src/models/resolver.ts:50

___

###  id

• **id**: *string*

Defined in did-resolver/src/models/resolver.ts:47

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

Defined in did-resolver/src/models/resolver.ts:54

___

###  publicKey

• **publicKey**: *[IPublicKey](ipublickey.md)[]*

Defined in did-resolver/src/models/resolver.ts:48

___

### `Optional` service

• **service**? : *[IServiceEndpoint](iserviceendpoint.md)[]*

Defined in did-resolver/src/models/resolver.ts:51

___

### `Optional` updated

• **updated**? : *string*

Defined in did-resolver/src/models/resolver.ts:53
