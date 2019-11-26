[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDDocument](ididdocument.md)

# Interface: IDIDDocument

This interface is a factory of Lite and Full DID Documents

## Hierarchy

* **IDIDDocument**

## Index

### Methods

* [createFull](ididdocument.md#createfull)
* [createLite](ididdocument.md#createlite)

## Methods

###  createFull

▸ **createFull**(`did`: [IDID](idid.md), `resolver`: IResolver): *[IDIDDocumentFull](ididdocumentfull.md)*

*Defined in [did-document/src/interface.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/199c41e/packages/did-document/src/interface.ts#L33)*

Provided with the DID and Resolver, full version of DID Document is returned

**Parameters:**

Name | Type |
------ | ------ |
`did` | [IDID](idid.md) |
`resolver` | IResolver |

**Returns:** *[IDIDDocumentFull](ididdocumentfull.md)*

___

###  createLite

▸ **createLite**(`did`: [IDID](idid.md), `resolver`: IResolver): *[IDIDDocumentLite](ididdocumentlite.md)*

*Defined in [did-document/src/interface.ts:25](https://github.com/energywebfoundation/ew-did-registry/blob/199c41e/packages/did-document/src/interface.ts#L25)*

Provided with the DID and Resolver, lite version of DID Document is returned

**Parameters:**

Name | Type |
------ | ------ |
`did` | [IDID](idid.md) |
`resolver` | IResolver |

**Returns:** *[IDIDDocumentLite](ididdocumentlite.md)*
