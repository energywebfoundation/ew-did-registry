[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [DIDRegistry](didregistry.md)

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

*Defined in [did-registry/src/index.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-registry/src/index.ts#L17)*

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

*Defined in [did-registry/src/index.ts:15](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-registry/src/index.ts#L15)*

___

###  did

• **did**: *IDID*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[did](../interfaces/ididregistry.md#did)*

*Defined in [did-registry/src/index.ts:9](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-registry/src/index.ts#L9)*

___

###  documentFactory

• **documentFactory**: *IDIDDocumentFactory*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[documentFactory](../interfaces/ididregistry.md#documentfactory)*

*Defined in [did-registry/src/index.ts:13](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-registry/src/index.ts#L13)*

___

###  keys

• **keys**: *Map‹Networks | string, IKeys›*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[keys](../interfaces/ididregistry.md#keys)*

*Defined in [did-registry/src/index.ts:11](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-registry/src/index.ts#L11)*

___

###  resolver

• **resolver**: *IResolver*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md).[resolver](../interfaces/ididregistry.md#resolver)*

*Defined in [did-registry/src/index.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-registry/src/index.ts#L17)*

## Methods

###  changeResolver

▸ **changeResolver**(`resolver`: IResolver, `network`: Networks | string): *void*

*Implementation of [IDIDRegistry](../interfaces/ididregistry.md)*

*Defined in [did-registry/src/index.ts:43](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-registry/src/index.ts#L43)*

Configures registry for use with another network

**`example`** 
```typescript
import DIDRegistry from '@ew-did-registry/did-regsitry';
import { Networks } from '@ew-did-registry/did';

const reg = new DIDRegistry(keys, ethDid, ethResolver);
reg.changeResolver(new Resolver(ewcSettings), Networks.EnergyWeb);
```

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

*Defined in [did-registry/src/index.ts:63](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-registry/src/index.ts#L63)*

Returns DID document of the corresponding did

**`example`** 
```typescript
import DIDRegistry from '@ew-did-registry/did-registry';

const document = await reg.read(did);
```

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹IDIDDocumentLite›*
