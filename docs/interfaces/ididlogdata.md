[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDLogData](ididlogdata.md)

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
* [owner](ididlogdata.md#owner)
* [proof](ididlogdata.md#optional-proof)
* [publicKey](ididlogdata.md#publickey)
* [serviceEndpoints](ididlogdata.md#optional-serviceendpoints)
* [topBlock](ididlogdata.md#topblock)
* [updated](ididlogdata.md#optional-updated)

## Properties

### `Optional` attributes

• **attributes**? : *Map‹string, object›*

*Defined in [did-resolver/src/models/resolver.ts:129](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L129)*

___

###  authentication

• **authentication**: *object*

*Defined in [did-resolver/src/models/resolver.ts:123](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L123)*

#### Type declaration:

* \[ **key**: *string*\]: [IAuthentication](iauthentication.md)

___

### `Optional` created

• **created**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:126](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L126)*

___

### `Optional` delegates

• **delegates**? : *string[]*

*Defined in [did-resolver/src/models/resolver.ts:124](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L124)*

___

###  owner

• **owner**: *string*

*Defined in [did-resolver/src/models/resolver.ts:120](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L120)*

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

*Defined in [did-resolver/src/models/resolver.ts:128](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L128)*

___

###  publicKey

• **publicKey**: *object*

*Defined in [did-resolver/src/models/resolver.ts:122](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L122)*

#### Type declaration:

* \[ **key**: *string*\]: [IPublicKey](ipublickey.md)

___

### `Optional` serviceEndpoints

• **serviceEndpoints**? : *object*

*Defined in [did-resolver/src/models/resolver.ts:125](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L125)*

#### Type declaration:

* \[ **key**: *string*\]: [IServiceEndpoint](iserviceendpoint.md)

___

###  topBlock

• **topBlock**: *BigNumber*

*Defined in [did-resolver/src/models/resolver.ts:121](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L121)*

___

### `Optional` updated

• **updated**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:127](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-resolver/src/models/resolver.ts#L127)*
