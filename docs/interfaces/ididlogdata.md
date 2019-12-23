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

*Defined in [did-resolver/src/models/index.ts:105](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L105)*

___

###  authentication

• **authentication**: *object*

*Defined in [did-resolver/src/models/index.ts:99](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L99)*

#### Type declaration:

* \[ **key**: *string*\]: [IAuthentication](iauthentication.md)

___

### `Optional` created

• **created**? : *string*

*Defined in [did-resolver/src/models/index.ts:102](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L102)*

___

### `Optional` delegates

• **delegates**? : *string[]*

*Defined in [did-resolver/src/models/index.ts:100](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L100)*

___

###  owner

• **owner**: *string*

*Defined in [did-resolver/src/models/index.ts:97](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L97)*

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

*Defined in [did-resolver/src/models/index.ts:104](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L104)*

___

###  publicKey

• **publicKey**: *object*

*Defined in [did-resolver/src/models/index.ts:98](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L98)*

#### Type declaration:

* \[ **key**: *string*\]: [IPublicKey](ipublickey.md)

___

### `Optional` serviceEndpoints

• **serviceEndpoints**? : *object*

*Defined in [did-resolver/src/models/index.ts:101](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L101)*

#### Type declaration:

* \[ **key**: *string*\]: [IServiceEndpoint](iserviceendpoint.md)

___

### `Optional` updated

• **updated**? : *string*

*Defined in [did-resolver/src/models/index.ts:103](https://github.com/energywebfoundation/ew-did-registry/blob/42b5428/packages/did-resolver/src/models/index.ts#L103)*
