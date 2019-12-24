[@ew-did-registry/did](../README.md) › [Globals](../globals.md) › [IOperator](ioperator.md)

# Interface: IOperator

## Hierarchy

* [IResolver](iresolver.md)

  ↳ **IOperator**

## Implemented by

* [Operator](../classes/operator.md)

## Index

### Methods

* [create](ioperator.md#create)
* [deactivate](ioperator.md#deactivate)
* [read](ioperator.md#read)
* [update](ioperator.md#update)

## Methods

###  create

▸ **create**(`did`: string, `context`: string): *Promise‹boolean›*

Defined in did-resolver/src/interface.ts:30

Registers a DID-Document for a given DID, and defines the provided context

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`context` | string |

**Returns:** *Promise‹boolean›*

___

###  deactivate

▸ **deactivate**(`did`: string): *Promise‹boolean›*

Defined in did-resolver/src/interface.ts:54

Attempts to deactivate the DID Document for a given DID.
Successful, if the transaction is accepted by the smart contract.
Deactivation should be done by the owner of DID

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹boolean›*

___

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](ididdocument.md)›*

*Inherited from [IResolver](iresolver.md).[read](iresolver.md#read)*

Defined in did-resolver/src/interface.ts:20

Read method resolves the DID Document for the provided DID.
Should not be confused with “read” method in DID Document Lite,
which returns the required attribute from the DID Document.

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](ididdocument.md)›*

___

###  update

▸ **update**(`did`: string, `attribute`: [DIDAttribute](../enums/didattribute.md), `value`: [IUpdateData](iupdatedata.md), `validity`: number | BigNumber): *Promise‹boolean›*

Defined in did-resolver/src/interface.ts:40

Updates relevant attribute of the DID Document

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`attribute` | [DIDAttribute](../enums/didattribute.md) |
`value` | [IUpdateData](iupdatedata.md) |
`validity` | number &#124; BigNumber |

**Returns:** *Promise‹boolean›*
