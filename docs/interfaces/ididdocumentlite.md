[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IDIDDocumentLite](ididdocumentlite.md)

# Interface: IDIDDocumentLite

Interface describes the lite version of DID Document with only read functionality

## Hierarchy

* **IDIDDocumentLite**

  ↳ [IDIDDocumentFull](ididdocumentfull.md)

## Implemented by

* [DIDDocumentFull](../classes/diddocumentfull.md)
* [DIDDocumentLite](../classes/diddocumentlite.md)

## Index

### Properties

* [did](ididdocumentlite.md#did)
* [didDocument](ididdocumentlite.md#diddocument)

### Methods

* [read](ididdocumentlite.md#read)

## Properties

###  did

• **did**: *string*

*Defined in [did-document/src/lite/interface.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/did-document/src/lite/interface.ts#L19)*

DID of Document subject is stored in DID Documents

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Defined in [did-document/src/lite/interface.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/did-document/src/lite/interface.ts#L24)*

Resolved DID Document

## Methods

###  read

▸ **read**(`attribute`: string, `type?`: string): *string | object*

*Defined in [did-document/src/lite/interface.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/d1c8ba6/packages/did-document/src/lite/interface.ts#L32)*

Fetches the specified data/attributes from DID Document

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | string |
`type?` | string |

**Returns:** *string | object*
