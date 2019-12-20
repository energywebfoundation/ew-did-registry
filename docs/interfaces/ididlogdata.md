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

*Defined in [did-resolver/src/models/index.ts:97](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L97)*

___

###  authentication

• **authentication**: *object*

*Defined in [did-resolver/src/models/index.ts:91](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L91)*

#### Type declaration:

* \[ **key**: *string*\]: string

___

### `Optional` created

• **created**? : *string*

*Defined in [did-resolver/src/models/index.ts:94](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L94)*

___

### `Optional` delegates

• **delegates**? : *string[]*

*Defined in [did-resolver/src/models/index.ts:92](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L92)*

___

###  owner

• **owner**: *string*

*Defined in [did-resolver/src/models/index.ts:89](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L89)*

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

*Defined in [did-resolver/src/models/index.ts:96](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L96)*

___

###  publicKey

• **publicKey**: *object*

*Defined in [did-resolver/src/models/index.ts:90](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L90)*

#### Type declaration:

* \[ **key**: *string*\]: [IPublicKey](ipublickey.md)

___

### `Optional` serviceEndpoints

• **serviceEndpoints**? : *object*

*Defined in [did-resolver/src/models/index.ts:93](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L93)*

#### Type declaration:

* \[ **key**: *string*\]: [IServiceEndpoint](iserviceendpoint.md)

___

### `Optional` updated

• **updated**? : *string*

*Defined in [did-resolver/src/models/index.ts:95](https://github.com/energywebfoundation/ew-did-registry/blob/4f4b6da/packages/did-resolver/src/models/index.ts#L95)*
