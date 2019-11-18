[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDRegistry](ididregistry.md)

# Interface: IDIDRegistry

## Hierarchy

* **IDIDRegistry**

## Index

### Properties

* [claims](ididregistry.md#claims)
* [did](ididregistry.md#did)
* [didDocument](ididregistry.md#diddocument)
* [keys](ididregistry.md#keys)

### Methods

* [addProvider](ididregistry.md#addprovider)

## Properties

###  claims

• **claims**: *IClaims*

*Defined in [did-registry/src/interface.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/2ba94ee/packages/did-registry/src/interface.ts#L17)*

___

###  did

• **did**: *IDID*

*Defined in [did-registry/src/interface.ts:15](https://github.com/energywebfoundation/ew-did-registry/blob/2ba94ee/packages/did-registry/src/interface.ts#L15)*

This is responsible for registration and lifecycle management of DID

IDID specifies the interface for decentralised identities
IDIDDocument exposes methods to operate with DID Documents
IClaims exposes functionality needed to manage Private and Public claims
IKeys is responsible for key management, signing, as well as verification of signature

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Defined in [did-registry/src/interface.ts:16](https://github.com/energywebfoundation/ew-did-registry/blob/2ba94ee/packages/did-registry/src/interface.ts#L16)*

___

###  keys

• **keys**: *IKeys*

*Defined in [did-registry/src/interface.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/2ba94ee/packages/did-registry/src/interface.ts#L18)*

## Methods

###  addProvider

▸ **addProvider**(`provider`: string): *void*

*Defined in [did-registry/src/interface.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/2ba94ee/packages/did-registry/src/interface.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`provider` | string |

**Returns:** *void*
