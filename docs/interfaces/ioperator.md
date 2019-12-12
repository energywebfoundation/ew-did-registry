[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IOperator](ioperator.md)

# Interface: IOperator

## Hierarchy

* [IResolver](iresolver.md)

  ↳ **IOperator**

## Index

### Methods

* [create](ioperator.md#create)
* [deactivate](ioperator.md#deactivate)
* [read](ioperator.md#read)
* [update](ioperator.md#update)

## Methods

###  create

▸ **create**(`did`: string, `context`: string): *Promise‹boolean›*

*Defined in [did-resolver/src/interface.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/did-resolver/src/interface.ts#L30)*

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

*Defined in [did-resolver/src/interface.ts:48](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/did-resolver/src/interface.ts#L48)*

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

*Defined in [did-resolver/src/interface.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/did-resolver/src/interface.ts#L20)*

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

▸ **update**(`did`: string, `attribute`: string, `value`: string | object): *Promise‹boolean›*

*Defined in [did-resolver/src/interface.ts:39](https://github.com/energywebfoundation/ew-did-registry/blob/c7209ba/packages/did-resolver/src/interface.ts#L39)*

Updates relevant attribute of the DID Document

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`attribute` | string |
`value` | string &#124; object |

**Returns:** *Promise‹boolean›*
