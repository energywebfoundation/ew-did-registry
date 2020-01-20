[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IDIDLogData](ididlogdata.md)

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

*Defined in [did-resolver/src/models/resolver.ts:110](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L110)*

___

###  authentication

• **authentication**: *object*

*Defined in [did-resolver/src/models/resolver.ts:104](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L104)*

#### Type declaration:

* \[ **key**: *string*\]: [IAuthentication](iauthentication.md)

___

### `Optional` created

• **created**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:107](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L107)*

___

### `Optional` delegates

• **delegates**? : *string[]*

*Defined in [did-resolver/src/models/resolver.ts:105](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L105)*

___

###  lastChangedBlock

• **lastChangedBlock**: *BigNumber*

*Defined in [did-resolver/src/models/resolver.ts:102](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L102)*

___

###  owner

• **owner**: *string*

*Defined in [did-resolver/src/models/resolver.ts:101](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L101)*

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

*Defined in [did-resolver/src/models/resolver.ts:109](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L109)*

___

###  publicKey

• **publicKey**: *object*

*Defined in [did-resolver/src/models/resolver.ts:103](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L103)*

#### Type declaration:

* \[ **key**: *string*\]: [IPublicKey](ipublickey.md)

___

### `Optional` serviceEndpoints

• **serviceEndpoints**? : *object*

*Defined in [did-resolver/src/models/resolver.ts:106](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L106)*

#### Type declaration:

* \[ **key**: *string*\]: [IServiceEndpoint](iserviceendpoint.md)

___

### `Optional` updated

• **updated**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:108](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did-resolver/src/models/resolver.ts#L108)*
