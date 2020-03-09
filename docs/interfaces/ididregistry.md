[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDRegistry](ididregistry.md)

# Interface: IDIDRegistry

This is responsible for registration and lifecycle management of DID

## Hierarchy

* **IDIDRegistry**

## Implemented by

* [DIDRegistry](../classes/didregistry.md)

## Index

### Properties

* [claims](ididregistry.md#claims)
* [did](ididregistry.md#did)
* [documentFactory](ididregistry.md#documentfactory)
* [keys](ididregistry.md#keys)
* [resolver](ididregistry.md#resolver)

### Methods

* [changeResolver](ididregistry.md#changeresolver)
* [read](ididregistry.md#read)

## Properties

###  claims

• **claims**: *IClaimsFactory*

*Defined in [did-registry/src/interface.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-registry/src/interface.ts#L22)*

IClaims exposes functionality needed to manage Private and Public claims

___

###  did

• **did**: *IDID*

*Defined in [did-registry/src/interface.ts:14](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-registry/src/interface.ts#L14)*

IDID specifies the interface for decentralised identities

___

###  documentFactory

• **documentFactory**: *IDIDDocumentFactory*

*Defined in [did-registry/src/interface.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-registry/src/interface.ts#L18)*

IDIDDocument exposes methods to operate with DID Documents

___

###  keys

• **keys**: *Map‹Networks | string, IKeys›*

*Defined in [did-registry/src/interface.ts:26](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-registry/src/interface.ts#L26)*

IKeys is responsible for key management, signing, as well as verification of signature

___

###  resolver

• **resolver**: *IResolver*

*Defined in [did-registry/src/interface.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-registry/src/interface.ts#L30)*

Resolver allows to create DID Documents for different ids

## Methods

###  changeResolver

▸ **changeResolver**(`resolver`: IResolver, `network`: Networks | string): *void*

*Defined in [did-registry/src/interface.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-registry/src/interface.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`resolver` | IResolver |
`network` | Networks &#124; string |

**Returns:** *void*

___

###  read

▸ **read**(`did`: string): *Promise‹IDIDDocumentLite›*

*Defined in [did-registry/src/interface.ts:34](https://github.com/energywebfoundation/ew-did-registry/blob/b1d68b0/packages/did-registry/src/interface.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹IDIDDocumentLite›*
