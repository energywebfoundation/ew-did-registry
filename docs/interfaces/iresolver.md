[@ew-did-registry/did](../README.md) › [Globals](../globals.md) › [IResolver](iresolver.md)

# Interface: IResolver

## Hierarchy

* **IResolver**

  ↳ [IOperator](ioperator.md)

## Implemented by

* [Operator](../classes/operator.md)
* [Resolver](../classes/resolver.md)

## Index

### Methods

* [read](iresolver.md#read)

## Methods

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](ididdocument.md)›*

Defined in did-resolver/src/interface.ts:20

Read method resolves the DID Document for the provided DID.
Should not be confused with “read” method in DID Document Lite,
which returns the required attribute from the DID Document.

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](ididdocument.md)›*
