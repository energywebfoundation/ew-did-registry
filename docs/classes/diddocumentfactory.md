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

Defined in did-document/src/factory/did-document-factory.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *[DIDDocumentFactory](diddocumentfactory.md)*

## Methods

###  createFull

▸ **createFull**(`operator`: IOperator, `did?`: string): *[IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

*Implementation of [IDIDDocumentFactory](../interfaces/ididdocumentfactory.md)*

Defined in did-document/src/factory/did-document-factory.ts:13

**Parameters:**

Name | Type |
------ | ------ |
`operator` | IOperator |
`did?` | string |

**Returns:** *[IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

___

###  createLite

▸ **createLite**(`resolver`: IResolver, `did?`: string): *[IDIDDocumentLite](../interfaces/ididdocumentlite.md)*

*Implementation of [IDIDDocumentFactory](../interfaces/ididdocumentfactory.md)*

Defined in did-document/src/factory/did-document-factory.ts:17

**Parameters:**

Name | Type |
------ | ------ |
`resolver` | IResolver |
`did?` | string |

**Returns:** *[IDIDDocumentLite](../interfaces/ididdocumentlite.md)*
