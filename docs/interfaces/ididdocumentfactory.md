[@ew-did-registry/did - v1.0.0](../README.md) › [Globals](../globals.md) › [IDIDDocumentFactory](ididdocumentfactory.md)

# Interface: IDIDDocumentFactory

This interface is a factory of Lite and Full DID Documents

## Hierarchy

* **IDIDDocumentFactory**

## Implemented by

* [DIDDocumentFactory](../classes/diddocumentfactory.md)

## Index

### Methods

* [createFull](ididdocumentfactory.md#createfull)
* [createLite](ididdocumentfactory.md#createlite)

## Methods

###  createFull

▸ **createFull**(`operator`: IOperator, `did?`: string): *[IDIDDocumentFull](ididdocumentfull.md)*

*Defined in [did-document/src/interface.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/1ed60e5/packages/did-document/src/interface.ts#L32)*

Provided with the DID and Resolver, full version of DID Document is returned

**Parameters:**

Name | Type |
------ | ------ |
`operator` | IOperator |
`did?` | string |

**Returns:** *[IDIDDocumentFull](ididdocumentfull.md)*

___

###  createLite

▸ **createLite**(`resolver`: IResolver, `did?`: string): *[IDIDDocumentLite](ididdocumentlite.md)*

*Defined in [did-document/src/interface.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/1ed60e5/packages/did-document/src/interface.ts#L24)*

Provided with the DID and Resolver, lite version of DID Document is returned

**Parameters:**

Name | Type |
------ | ------ |
`resolver` | IResolver |
`did?` | string |

**Returns:** *[IDIDDocumentLite](ididdocumentlite.md)*
