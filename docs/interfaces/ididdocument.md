[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDIDDocument](ididdocument.md)

# Interface: IDIDDocument

## Hierarchy

* **IDIDDocument**

## Index

### Properties

* [authentication](ididdocument.md#authentication)
* [context](ididdocument.md#context)
* [created](ididdocument.md#created)
* [delegates](ididdocument.md#delegates)
* [id](ididdocument.md#id)
* [proof](ididdocument.md#optional-proof)
* [publicKey](ididdocument.md#publickey)
* [service](ididdocument.md#service)
* [updated](ididdocument.md#updated)

## Properties

###  authentication

• **authentication**: *Array‹[IAuthentication](iauthentication.md) | string›*

Defined in did-resolver/src/models/index.ts:30

___

###  context

• **context**: *string*

Defined in did-resolver/src/models/index.ts:27

___

###  created

• **created**: *string*

Defined in did-resolver/src/models/index.ts:33

___

###  delegates

• **delegates**: *string[]*

Defined in did-resolver/src/models/index.ts:31

___

###  id

• **id**: *string*

Defined in did-resolver/src/models/index.ts:28

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

Defined in did-resolver/src/models/index.ts:35

___

###  publicKey

• **publicKey**: *[IPublicKey](ipublickey.md)[]*

Defined in did-resolver/src/models/index.ts:29

___

###  service

• **service**: *[IServiceEndpoint](iserviceendpoint.md)[]*

Defined in did-resolver/src/models/index.ts:32

___

###  updated

• **updated**: *string*

Defined in did-resolver/src/models/index.ts:34

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
