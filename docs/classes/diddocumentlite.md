[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [DIDDocumentLite](diddocumentlite.md)

# Class: DIDDocumentLite

## Hierarchy

* **DIDDocumentLite**

  ↳ [DIDDocumentFull](diddocumentfull.md)

## Implements

* [IDIDDocumentLite](../interfaces/ididdocumentlite.md)

## Index

### Constructors

* [constructor](diddocumentlite.md#constructor)

### Properties

* [did](diddocumentlite.md#did)
* [didDocument](diddocumentlite.md#diddocument)

### Methods

* [read](diddocumentlite.md#read)

## Constructors

###  constructor

\+ **new DIDDocumentLite**(`did`: string, `resolver`: IResolver): *[DIDDocumentLite](diddocumentlite.md)*

*Defined in [did-document/src/lite/index.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-document/src/lite/index.ts#L18)*

Constructor takes DID of interest and Resolver as inputs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`did` | string | - |
`resolver` | IResolver |   |

**Returns:** *[DIDDocumentLite](diddocumentlite.md)*

## Properties

###  did

• **did**: *string*

*Implementation of [IDIDDocumentLite](../interfaces/ididdocumentlite.md).[did](../interfaces/ididdocumentlite.md#did)*

*Defined in [did-document/src/lite/index.ts:13](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-document/src/lite/index.ts#L13)*

DID of concern

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Implementation of [IDIDDocumentLite](../interfaces/ididdocumentlite.md).[didDocument](../interfaces/ididdocumentlite.md#diddocument)*

*Defined in [did-document/src/lite/index.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-document/src/lite/index.ts#L18)*

Fetched DID Document

## Methods

###  read

▸ **read**(`attribute`: string, `type`: string): *Promise‹string | object›*

*Implementation of [IDIDDocumentLite](../interfaces/ididdocumentlite.md)*

*Defined in [did-document/src/lite/index.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/did-document/src/lite/index.ts#L50)*

Method returns the attribute of interest. An optional type parameter can be provided for
attributes, which are objects

**`example`** 
```typescript
import { Resolver } from '@ew-did-registry/did-resolver';
import { DIDDocumentFactory } from '@ew-did-registry/did-document';

const sampleDid = 'did:ewc:0xe2e457aB987BEd9AbdEE9410FC985E46e28a3947';
const resolver = new Resolver();
const didLiteDocument = DIDDocumentFactory.createLite(sampleDid, resolver);
const id = didDocumentLite.read('id');

console.log(`DID of the fetched document is ${id}`);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`attribute` | string | - |
`type` | string |   |

**Returns:** *Promise‹string | object›*
