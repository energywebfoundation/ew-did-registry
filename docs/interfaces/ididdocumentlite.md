[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDDocumentLite](ididdocumentlite.md)

# Interface: IDIDDocumentLite

Interface describes the lite version of DID Document with only read functionality

## Hierarchy

* **IDIDDocumentLite**

  ↳ [IDIDDocumentFull](ididdocumentfull.md)

## Index

### Properties

* [did](ididdocumentlite.md#did)

### Methods

* [read](ididdocumentlite.md#read)

## Properties

###  did

• **did**: *string*

*Defined in [did-document/src/lite/interface.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/0fe06b3/packages/did-document/src/lite/interface.ts#L17)*

DID of Document subject is stored in DID Documents

## Methods

###  read

▸ **read**(`attribute`: string, `type?`: string): *string*

*Defined in [did-document/src/lite/interface.ts:25](https://github.com/energywebfoundation/ew-did-registry/blob/0fe06b3/packages/did-document/src/lite/interface.ts#L25)*

Fetches the specified data/attributes from DID Document

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | string |
`type?` | string |

**Returns:** *string*
