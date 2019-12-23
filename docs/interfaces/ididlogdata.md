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
* [owner](ididlogdata.md#owner)
* [proof](ididlogdata.md#optional-proof)
* [publicKey](ididlogdata.md#publickey)
* [serviceEndpoints](ididlogdata.md#optional-serviceendpoints)
* [updated](ididlogdata.md#optional-updated)

## Properties

### `Optional` attributes

• **attributes**? : *Map‹string, object›*

Defined in did-resolver/src/models/index.ts:100

___

###  authentication

• **authentication**: *object*

Defined in did-resolver/src/models/index.ts:94

#### Type declaration:

* \[ **key**: *string*\]: string

___

### `Optional` created

• **created**? : *string*

Defined in did-resolver/src/models/index.ts:97

___

### `Optional` delegates

• **delegates**? : *string[]*

Defined in did-resolver/src/models/index.ts:95

___

###  owner

• **owner**: *string*

Defined in did-resolver/src/models/index.ts:92

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

Defined in did-resolver/src/models/index.ts:99

___

###  publicKey

• **publicKey**: *object*

Defined in did-resolver/src/models/index.ts:93

#### Type declaration:

* \[ **key**: *string*\]: [IPublicKey](ipublickey.md)

___

### `Optional` serviceEndpoints

• **serviceEndpoints**? : *object*

Defined in did-resolver/src/models/index.ts:96

#### Type declaration:

* \[ **key**: *string*\]: [IServiceEndpoint](iserviceendpoint.md)

___

### `Optional` updated

• **updated**? : *string*

Defined in did-resolver/src/models/index.ts:98
