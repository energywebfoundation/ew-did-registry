[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IDIDLogData](ididlogdata.md)

# Interface: IDIDLogData

This interface is used to store the parse data from events.
The log data will be used for caching and further analysed to construct the did document,
as new data arrives.
The data in the did document will exclude certain variables, such as
'lastChangedBlock', 'created', 'updated', 'proof'

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

*Defined in [did-resolver/src/models/resolver.ts:132](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L132)*

___

###  authentication

• **authentication**: *object*

*Defined in [did-resolver/src/models/resolver.ts:126](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L126)*

#### Type declaration:

* \[ **key**: *string*\]: [IAuthentication](iauthentication.md)

___

### `Optional` created

• **created**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:129](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L129)*

___

### `Optional` delegates

• **delegates**? : *string[]*

*Defined in [did-resolver/src/models/resolver.ts:127](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L127)*

___

###  lastChangedBlock

• **lastChangedBlock**: *BigNumber*

*Defined in [did-resolver/src/models/resolver.ts:124](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L124)*

___

###  owner

• **owner**: *string*

*Defined in [did-resolver/src/models/resolver.ts:123](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L123)*

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

*Defined in [did-resolver/src/models/resolver.ts:131](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L131)*

___

###  publicKey

• **publicKey**: *object*

*Defined in [did-resolver/src/models/resolver.ts:125](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L125)*

#### Type declaration:

* \[ **key**: *string*\]: [IPublicKey](ipublickey.md)

___

### `Optional` serviceEndpoints

• **serviceEndpoints**? : *object*

*Defined in [did-resolver/src/models/resolver.ts:128](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L128)*

#### Type declaration:

* \[ **key**: *string*\]: [IServiceEndpoint](iserviceendpoint.md)

___

### `Optional` updated

• **updated**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:130](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-resolver/src/models/resolver.ts#L130)*
