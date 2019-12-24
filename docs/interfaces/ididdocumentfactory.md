[@ew-did-registry/did](../README.md) › [Globals](../globals.md) › [IDIDDocumentFactory](ididdocumentfactory.md)

# Interface: IDIDDocumentFactory

This interface is a factory of Lite and Full DID Documents

## Hierarchy

* **IDIDDocumentFactory**

## Index

### Methods

* [createFull](ididdocumentfactory.md#createfull)
* [createLite](ididdocumentfactory.md#createlite)

## Methods

###  createFull

▸ **createFull**(`did`: string, `operator`: IOperator): *[IDIDDocumentFull](ididdocumentfull.md)*

Defined in did-document/src/interface.ts:32

Provided with the DID and Resolver, full version of DID Document is returned

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`operator` | IOperator |

**Returns:** *[IDIDDocumentFull](ididdocumentfull.md)*

___

###  createLite

▸ **createLite**(`did`: string, `resolver`: IResolver): *[IDIDDocumentLite](ididdocumentlite.md)*

Defined in did-document/src/interface.ts:24

Provided with the DID and Resolver, lite version of DID Document is returned

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`resolver` | IResolver |

**Returns:** *[IDIDDocumentLite](ididdocumentlite.md)*
