[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IResolver](iresolver.md)

# Interface: IResolver

## Hierarchy

* **IResolver**

  ↳ [IOperator](ioperator.md)

## Index

### Methods

* [read](iresolver.md#read)

## Methods

###  read

▸ **read**(`did`: string): *[IDIDDocument](ididdocument.md)*

*Defined in [did-resolver/src/interface.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/573253b/packages/did-resolver/src/interface.ts#L20)*

Read method resolves the DID Document for the provided DID.
Should not be confused with “read” method in DID Document Lite,
which returns the required attribute from the DID Document.

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *[IDIDDocument](ididdocument.md)*
