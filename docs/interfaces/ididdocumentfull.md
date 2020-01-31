[@ew-did-registry/did - v1.0.0](../README.md) › [Globals](../globals.md) › [IDIDDocumentFull](ididdocumentfull.md)

# Interface: IDIDDocumentFull

Interface describes the full version of DID Document with CRUD functionality
This interface extends lite DID Document interface

## Hierarchy

* [IDIDDocumentLite](ididdocumentlite.md)

  ↳ **IDIDDocumentFull**

## Implemented by

* [DIDDocumentFull](../classes/diddocumentfull.md)

## Index

### Properties

* [did](ididdocumentfull.md#did)
* [didDocument](ididdocumentfull.md#diddocument)

### Methods

* [create](ididdocumentfull.md#create)
* [deactivate](ididdocumentfull.md#deactivate)
* [read](ididdocumentfull.md#read)
* [update](ididdocumentfull.md#update)

## Properties

###  did

• **did**: *string*

*Inherited from [IDIDDocumentLite](ididdocumentlite.md).[did](ididdocumentlite.md#did)*

*Defined in [did-document/src/lite/interface.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/1ed60e5/packages/did-document/src/lite/interface.ts#L19)*

DID of Document subject is stored in DID Documents

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Inherited from [IDIDDocumentLite](ididdocumentlite.md).[didDocument](ididdocumentlite.md#diddocument)*

*Defined in [did-document/src/lite/interface.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/1ed60e5/packages/did-document/src/lite/interface.ts#L24)*

Resolved DID Document

## Methods

###  create

▸ **create**(`context`: string): *Promise‹boolean›*

*Defined in [did-document/src/full/interface.ts:17](https://github.com/energywebfoundation/ew-did-registry/blob/1ed60e5/packages/did-document/src/full/interface.ts#L17)*

New DID Document is registered on the Blockchain with the provided context,
if no Document existed for the specified DID

**Parameters:**

Name | Type |
------ | ------ |
`context` | string |

**Returns:** *Promise‹boolean›*

___

###  deactivate

▸ **deactivate**(): *Promise‹boolean›*

*Defined in [did-document/src/full/interface.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/1ed60e5/packages/did-document/src/full/interface.ts#L31)*

On success the status of the DID Document is changed from “active” to “deactivated”.

**Returns:** *Promise‹boolean›*

___

###  read

▸ **read**(`attribute`: string, `type?`: string): *string | object*

*Inherited from [IDIDDocumentLite](ididdocumentlite.md).[read](ididdocumentlite.md#read)*

*Defined in [did-document/src/lite/interface.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/1ed60e5/packages/did-document/src/lite/interface.ts#L32)*

Fetches the specified data/attributes from DID Document

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | string |
`type?` | string |

**Returns:** *string | object*

___

###  update

▸ **update**(`attribute`: string, `data`: IUpdateData, `validity`: number | BigNumber): *Promise‹boolean›*

*Defined in [did-document/src/full/interface.ts:25](https://github.com/energywebfoundation/ew-did-registry/blob/1ed60e5/packages/did-document/src/full/interface.ts#L25)*

Provided with necessary parameters, method updates relevant attributes of the DID Document

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | string |
`data` | IUpdateData |
`validity` | number &#124; BigNumber |

**Returns:** *Promise‹boolean›*
