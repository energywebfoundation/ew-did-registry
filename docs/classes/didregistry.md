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

## Constructors

###  constructor

\+ **new DIDRegistry**(`keys`: IKeys, `did`: string, `resolver`: IResolver): *[DIDRegistry](didregistry.md)*

*Defined in [did-registry/src/index.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-registry/src/index.ts#L17)*

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

*Defined in [did-registry/src/index.ts:15](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-registry/src/index.ts#L15)*

___

###  did

• **did**: *IDID*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[did](../interfaces/ididregistry.md#did)*

*Defined in [did-registry/src/index.ts:9](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-registry/src/index.ts#L9)*

___

###  documentFactory

• **documentFactory**: *IDIDDocumentFactory*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[documentFactory](../interfaces/ididregistry.md#documentfactory)*

*Defined in [did-registry/src/index.ts:13](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-registry/src/index.ts#L13)*

___

###  keys

• **keys**: *Map‹Networks | string, IKeys›*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[keys](../interfaces/ididregistry.md#keys)*

*Defined in [did-registry/src/index.ts:11](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-registry/src/index.ts#L11)*

___

###  resolver

• **resolver**: *IResolver*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[resolver](../interfaces/ididregistry.md#resolver)*

*Defined in [did-registry/src/index.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-registry/src/index.ts#L17)*

## Methods

###  changeResolver

▸ **changeResolver**(`resolver`: IResolver, `network`: Networks | string): *void*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md)*

*Defined in [did-registry/src/index.ts:28](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-registry/src/index.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`resolver` | IResolver |
`network` | Networks &#124; string |

**Returns:** *void*
