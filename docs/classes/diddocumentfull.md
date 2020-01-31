[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [DIDDocumentFull](diddocumentfull.md)

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

*Defined in [did-document/src/full/documentFull.ts:8](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-document/src/full/documentFull.ts#L8)*

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

*Defined in [did-document/src/lite/index.ts:13](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-document/src/lite/index.ts#L13)*

DID of concern

___

###  didDocument

• **didDocument**: *IDIDDocument*

*Implementation of [IDIDDocumentFull](../interfaces/ididdocumentfull.md).[didDocument](../interfaces/ididdocumentfull.md#diddocument)*

*Inherited from [DIDDocumentLite](diddocumentlite.md).[didDocument](diddocumentlite.md#diddocument)*

*Defined in [did-document/src/lite/index.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-document/src/lite/index.ts#L18)*

Fetched DID Document

## Methods

###  create

▸ **create**(): *Promise‹boolean›*

*Defined in [did-document/src/full/documentFull.ts:27](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-document/src/full/documentFull.ts#L27)*

Creates new empty DID document

**`example`** 
```typescript
 import { DIDDocumentFull } from '@ew-did-registry/did-document';

 const document = new DIDDocumentFull(did, operator);
 await document.create();
```

**Returns:** *Promise‹boolean›*

___

###  deactivate

▸ **deactivate**(): *Promise‹boolean›*

*Implementation of [IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

*Defined in [did-document/src/full/documentFull.ts:45](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-document/src/full/documentFull.ts#L45)*

Deactivates DID document

**`example`** 
```typescript
import { DIDDocumentFull } from '@ew-did-registry/did-document';

const document = new DIDDocumentFull(did, operator);
await document.create();
await document.update(didAttribute, updateData, validity);
await document.deactivate();
```

**Returns:** *Promise‹boolean›*

___

###  read

▸ **read**(`attribute`: string, `type`: string): *Promise‹any›*

*Implementation of [IDIDDocumentFull](../interfaces/ididdocumentfull.md)*

*Inherited from [DIDDocumentLite](diddocumentlite.md).[read](diddocumentlite.md#read)*

*Defined in [did-document/src/lite/index.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-document/src/lite/index.ts#L50)*

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

**Returns:** *Promise‹any›*

___

###  update

▸ **update**(`attribute`: DIDAttribute, `data`: IUpdateData, `validity`: number): *Promise‹boolean›*

*Defined in [did-document/src/full/documentFull.ts:77](https://github.com/energywebfoundation/ew-did-registry/blob/162cbcc/packages/did-document/src/full/documentFull.ts#L77)*

Updates attribute on the DID document

**`example`** 
```typescript
import { DIDDocumentFull } from '@ew-did-registry/did-document';
import { DIDAttribute, Algorithms, PubKeyTypes } from '@ew-did-registry/did-document';

const document = new DIDDocumentFull(did, operator);
await document.create();
const didAttribute = DIDAttribute.PublicKey;
const validity = 5 * 60 * 1000;
await document.update(
 DIDAttribute.PublicKey,
 {
   type: PubKeyType.VerificationKey2018,
   algo: Algorithms.ED25519,
   encoding: Encoding.HEX,
   value: new Keys().publicKey,
 },
 validity,
 );
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`attribute` | DIDAttribute | - |
`data` | IUpdateData | - |
`validity` | number | time in milliseconds during the attribujte will be valid |

**Returns:** *Promise‹boolean›*
