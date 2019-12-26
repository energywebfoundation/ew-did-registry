[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [DIDDocumentFull](diddocumentfull.md)

# Class: DIDDocumentFull

## Hierarchy

* [DIDDocumentLite](diddocumentlite.md)

  ↳ **DIDDocumentFull**

## Implements

* [IDIDDocumentLite](../interfaces/ididdocumentlite.md)
* [IDIDDocumentFull](../interfaces/ididdocumentfull.md)

## Index

### Constructors

* [constructor](diddocumentfull.md#constructor)

### Properties

* [did](diddocumentfull.md#did)
* [didDocument](diddocumentfull.md#diddocument)

### Methods

* [create](diddocumentfull.md#create)
* [deactivate](diddocumentfull.md#deactivate)
* [read](diddocumentfull.md#read)
* [update](diddocumentfull.md#update)

## Constructors

###  constructor

\+ **new DIDDocumentFull**(`did`: string, `operator`: IOperator): *[DIDDocumentFull](diddocumentfull.md)*

*Overrides [DIDDocumentLite](diddocumentlite.md).[constructor](diddocumentlite.md#constructor)*

Defined in did-document/src/full/documentFull.ts:7

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`operator` | IOperator |

**Returns:** *[DIDDocumentFull](diddocumentfull.md)*

## Properties

###  did

• **did**: *string*

*Implementation of [IDIDDocumentFull](../interfaces/ididdocumentfull.md).[did](../interfaces/ididdocumentfull.md#did)*

*Inherited from [DIDDocumentLite](diddocumentlite.md).[did](diddocumentlite.md#did)*

Defined in did-document/src/lite/documentLite.ts:5

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Implementation of [IDIDDocumentFull](../interfaces/ididdocumentfull.md).[didDocument](../interfaces/ididdocumentfull.md#diddocument)*

*Inherited from [DIDDocumentLite](diddocumentlite.md).[didDocument](diddocumentlite.md#diddocument)*

Defined in did-document/src/lite/documentLite.ts:7

## Methods

###  create

▸ **create**(`context?`: string): *Promise‹boolean›*

*Implementation of [IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

Defined in did-document/src/full/documentFull.ts:14

**Parameters:**

Name | Type |
------ | ------ |
`context?` | string |

**Returns:** *Promise‹boolean›*

___

###  deactivate

▸ **deactivate**(): *Promise‹boolean›*

*Implementation of [IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

Defined in did-document/src/full/documentFull.ts:18

**Returns:** *Promise‹boolean›*

___

###  read

▸ **read**(`attribute`: string, `type?`: string): *string | object*

*Implementation of [IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

*Inherited from [DIDDocumentLite](diddocumentlite.md).[read](diddocumentlite.md#read)*

Defined in did-document/src/lite/documentLite.ts:16

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | string |
`type?` | string |

**Returns:** *string | object*

___

###  update

▸ **update**(`attribute`: DIDAttribute, `data`: IUpdateData, `validity`: number | BigNumber): *Promise‹boolean›*

Defined in did-document/src/full/documentFull.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`attribute` | DIDAttribute |
`data` | IUpdateData |
`validity` | number &#124; BigNumber |

**Returns:** *Promise‹boolean›*
