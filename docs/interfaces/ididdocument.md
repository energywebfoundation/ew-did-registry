[@ew-did-registry/did](../README.md) › [Globals](../globals.md) › [IDIDDocument](ididdocument.md)

# Interface: IDIDDocument

This interface is a factory of Lite and Full DID Documents

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

### Methods

* [createFull](ididdocument.md#createfull)
* [createLite](ididdocument.md#createlite)

## Properties

###  authentication

• **authentication**: *Array‹[IAuthentication](iauthentication.md) | string›*

Defined in did-document/src/models/index.ts:10

___

###  context

• **context**: *string*

Defined in did-document/src/models/index.ts:7

___

###  created

• **created**: *string*

Defined in did-document/src/models/index.ts:13

___

###  delegates

• **delegates**: *string[]*

Defined in did-document/src/models/index.ts:11

___

###  id

• **id**: *string*

Defined in did-document/src/models/index.ts:8

___

### `Optional` proof

• **proof**? : *[ILinkedDataProof](ilinkeddataproof.md)*

Defined in did-document/src/models/index.ts:15

___

###  publicKey

• **publicKey**: *[IPublicKey](ipublickey.md)[]*

Defined in did-document/src/models/index.ts:9

___

###  service

• **service**: *[IServiceEndpoint](iserviceendpoint.md)[]*

Defined in did-document/src/models/index.ts:12

___

###  updated

• **updated**: *string*

Defined in did-document/src/models/index.ts:14

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
