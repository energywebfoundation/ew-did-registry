[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDRegistry](ididregistry.md)

# Interface: IDIDRegistry

This is responsible for registration and lifecycle management of DID

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

Defined in did-registry/src/interface.ts:21

IClaims exposes functionality needed to manage Private and Public claims

___

###  did

• **did**: *IDID*

Defined in did-registry/src/interface.ts:13

IDID specifies the interface for decentralised identities

___

###  didDocument

• **didDocument**: *IDIDDocument*

Defined in did-registry/src/interface.ts:17

IDIDDocument exposes methods to operate with DID Documents

___

###  keys

• **keys**: *IKeys*

Defined in did-registry/src/interface.ts:25

IKeys is responsible for key management, signing, as well as verification of signature

## Methods

###  addProvider

▸ **addProvider**(`provider`: string): *void*

Defined in did-registry/src/interface.ts:27

**Parameters:**

Name | Type |
------ | ------ |
`provider` | string |

**Returns:** *void*
