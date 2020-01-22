[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IOperator](ioperator.md)

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
* [identityOwner](ioperator.md#identityowner)
* [read](ioperator.md#read)
* [update](ioperator.md#update)
* [validDelegate](ioperator.md#validdelegate)

## Methods

###  create

▸ **create**(): *Promise‹boolean›*

*Defined in [did-resolver/src/interface.ts:47](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/interface.ts#L47)*

Registers a DID-Document for a given DID, and defines the provided context

**Returns:** *Promise‹boolean›*

___

###  deactivate

▸ **deactivate**(`did`: string): *Promise‹boolean›*

*Defined in [did-resolver/src/interface.ts:71](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/interface.ts#L71)*

Attempts to deactivate the DID Document for a given DID.
Successful, if the transaction is accepted by the smart contract.
Deactivation should be done by the owner of DID

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹boolean›*

___

###  identityOwner

▸ **identityOwner**(`did`: string): *Promise‹string›*

*Inherited from [IResolver](iresolver.md).[identityOwner](iresolver.md#identityowner)*

*Defined in [did-resolver/src/interface.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/interface.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹string›*

___

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](ididdocument.md)›*

*Inherited from [IResolver](iresolver.md).[read](iresolver.md#read)*

*Defined in [did-resolver/src/interface.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/interface.ts#L29)*

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

*Defined in [did-resolver/src/interface.ts:57](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/interface.ts#L57)*

Updates relevant attribute of the DID Document

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`attribute` | [DIDAttribute](../enums/didattribute.md) |
`value` | [IUpdateData](iupdatedata.md) |
`validity` | number &#124; BigNumber |

**Returns:** *Promise‹boolean›*

___

###  validDelegate

▸ **validDelegate**(`identityDID`: string, `delegateType`: [DelegateTypes](../enums/delegatetypes.md), `delegateDID`: string): *Promise‹boolean›*

*Inherited from [IResolver](iresolver.md).[validDelegate](iresolver.md#validdelegate)*

*Defined in [did-resolver/src/interface.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/interface.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`identityDID` | string |
`delegateType` | [DelegateTypes](../enums/delegatetypes.md) |
`delegateDID` | string |

**Returns:** *Promise‹boolean›*
