[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IResolver](iresolver.md)

# Interface: IResolver

## Hierarchy

* **IResolver**

  ↳ [IOperator](ioperator.md)

## Implemented by

* [Operator](../classes/operator.md)
* [Resolver](../classes/resolver.md)

## Index

### Methods

* [identityOwner](iresolver.md#identityowner)
* [read](iresolver.md#read)
* [validDelegate](iresolver.md#validdelegate)

## Methods

###  identityOwner

▸ **identityOwner**(`did`: string): *Promise‹string›*

*Defined in [did-resolver/src/interface.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/did-resolver/src/interface.ts#L31)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹string›*

___

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](ididdocument.md)›*

*Defined in [did-resolver/src/interface.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/did-resolver/src/interface.ts#L29)*

Read method resolves the DID Document for the provided DID.
Should not be confused with “read” method in DID Document Lite,
which returns the required attribute from the DID Document.

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](ididdocument.md)›*

___

###  validDelegate

▸ **validDelegate**(`identityDID`: string, `delegateType`: [DelegateTypes](../enums/delegatetypes.md), `delegateDID`: string): *Promise‹boolean›*

*Defined in [did-resolver/src/interface.ts:33](https://github.com/energywebfoundation/ew-did-registry/blob/ff7b2ca/packages/did-resolver/src/interface.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`identityDID` | string |
`delegateType` | [DelegateTypes](../enums/delegatetypes.md) |
`delegateDID` | string |

**Returns:** *Promise‹boolean›*
