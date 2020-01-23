[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [DIDRegistry](didregistry.md)

# Class: DIDRegistry

## Hierarchy

* **DIDRegistry**

## Implements

* [IDIDRegistry](../interfaces/ididregistry.md)

## Index

### Constructors

* [constructor](didregistry.md#constructor)

### Properties

* [claims](didregistry.md#claims)
* [did](didregistry.md#did)
* [documentFactory](didregistry.md#documentfactory)
* [keys](didregistry.md#keys)
* [resolver](didregistry.md#resolver)

### Methods

* [changeResolver](didregistry.md#changeresolver)
* [read](didregistry.md#read)

## Constructors

###  constructor

\+ **new DIDRegistry**(`keys`: IKeys, `did`: string, `resolver`: IResolver): *[DIDRegistry](didregistry.md)*

Defined in did-registry/src/index.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`did` | string |
`resolver` | IResolver |

**Returns:** *[DIDRegistry](didregistry.md)*

## Properties

###  claims

• **claims**: *IClaimsFactory*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[claims](../interfaces/ididregistry.md#claims)*

Defined in did-registry/src/index.ts:15

___

###  did

• **did**: *IDID*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[did](../interfaces/ididregistry.md#did)*

Defined in did-registry/src/index.ts:9

___

###  documentFactory

• **documentFactory**: *IDIDDocumentFactory*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[documentFactory](../interfaces/ididregistry.md#documentfactory)*

Defined in did-registry/src/index.ts:13

___

###  keys

• **keys**: *Map‹Networks | string, IKeys›*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[keys](../interfaces/ididregistry.md#keys)*

Defined in did-registry/src/index.ts:11

___

###  resolver

• **resolver**: *IResolver*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[resolver](../interfaces/ididregistry.md#resolver)*

Defined in did-registry/src/index.ts:17

## Methods

###  changeResolver

▸ **changeResolver**(`resolver`: IResolver, `network`: Networks | string): *void*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md)*

Defined in did-registry/src/index.ts:28

**Parameters:**

Name | Type |
------ | ------ |
`resolver` | IResolver |
`network` | Networks &#124; string |

**Returns:** *void*

___

###  read

▸ **read**(`did`: string): *Promise‹IDIDDocumentLite›*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md)*

Defined in did-registry/src/index.ts:35

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹IDIDDocumentLite›*
