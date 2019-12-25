[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDLogData](ididlogdata.md)

# Interface: IDIDLogData

## Hierarchy

* **IDIDLogData**

## Index

### Properties

* [attributes](ididlogdata.md#optional-attributes)
* [authentication](ididlogdata.md#authentication)
* [created](ididlogdata.md#optional-created)
* [delegates](ididlogdata.md#optional-delegates)
* [lastChangedBlock](ididlogdata.md#lastchangedblock)
* [owner](ididlogdata.md#owner)
* [proof](ididlogdata.md#optional-proof)
* [publicKey](ididlogdata.md#publickey)
* [serviceEndpoints](ididlogdata.md#optional-serviceendpoints)
* [updated](ididlogdata.md#optional-updated)

## Properties

### `Optional` attributes

• **attributes**? : *Map‹string, object›*

Defined in did-resolver/src/models/resolver.ts:110

___

###  authentication

• **authentication**: *object*

Defined in did-resolver/src/models/resolver.ts:104

#### Type declaration:

* \[ **key**: *string*\]: [IAuthentication](iauthentication.md)

___

### `Optional` created

• **created**? : *string*

Defined in did-resolver/src/models/resolver.ts:107

___

### `Optional` delegates

• **delegates**? : *string[]*

Defined in did-resolver/src/models/resolver.ts:105

___

###  lastChangedBlock

• **lastChangedBlock**: *BigNumber*

Defined in did-resolver/src/models/resolver.ts:102

___

###  owner

• **owner**: *string*

Defined in did-resolver/src/models/resolver.ts:101

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

Defined in did-resolver/src/models/resolver.ts:109

___

###  publicKey

• **publicKey**: *object*

Defined in did-resolver/src/models/resolver.ts:103

#### Type declaration:

* \[ **key**: *string*\]: [IPublicKey](ipublickey.md)

___

### `Optional` serviceEndpoints

• **serviceEndpoints**? : *object*

Defined in did-resolver/src/models/resolver.ts:106

#### Type declaration:

* \[ **key**: *string*\]: [IServiceEndpoint](iserviceendpoint.md)

___

### `Optional` updated

• **updated**? : *string*

Defined in did-resolver/src/models/resolver.ts:108
