[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [DIDDocumentFactory](diddocumentfactory.md)

# Class: DIDDocumentFactory

## Hierarchy

* **DIDDocumentFactory**

## Implements

* [IDIDDocumentFactory](../interfaces/ididdocumentfactory.md)

## Index

### Constructors

* [constructor](diddocumentfactory.md#constructor)

### Methods

* [createFull](diddocumentfactory.md#createfull)
* [createLite](diddocumentfactory.md#createlite)

## Constructors

###  constructor

\+ **new DIDDocumentFactory**(`did`: string): *[DIDDocumentFactory](diddocumentfactory.md)*

*Defined in [did-document/src/factory/did-document-factory.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/did-document/src/factory/did-document-factory.ts#L10)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *[DIDDocumentFactory](diddocumentfactory.md)*

## Methods

###  createFull

▸ **createFull**(`operator`: IOperator, `did?`: string): *[IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

*Implementation of [IDIDDocumentFactory](../interfaces/ididdocumentfactory.md)*

*Defined in [did-document/src/factory/did-document-factory.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/did-document/src/factory/did-document-factory.ts#L31)*

Creates an instance of DIDDocumentFull

**`example`** 
```typescript
import { DIDDocumentFactory, DIDDocumentFull } from '@ew-did-registry/did-document';

const factory = new DIDDocumentFactory(did);
const DIDDocumentFull = factory.createFull(operator);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`operator` | IOperator | - |
`did?` | string |   |

**Returns:** *[IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

___

###  createLite

▸ **createLite**(`resolver`: IResolver, `did?`: string): *[IDIDDocumentLite](../interfaces/ididdocumentlite.md)*

*Implementation of [IDIDDocumentFactory](../interfaces/ididdocumentfactory.md)*

*Defined in [did-document/src/factory/did-document-factory.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/36ca36d/packages/did-document/src/factory/did-document-factory.ts#L50)*

Creates an instance of DIDDocumentFull

**`example`** 
```typescript
import { DIDDocumentFactory, DIDDocumentLite } from '@ew-did-registry/did-document';

const factory = new DIDDocumentFactory(did);
const DIDDocumentFull = factory.createLite(resolver);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`resolver` | IResolver | - |
`did?` | string |   |

**Returns:** *[IDIDDocumentLite](../interfaces/ididdocumentlite.md)*
