[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IOperator](ioperator.md)

# Interface: IOperator

## Hierarchy

* [IResolver](iresolver.md)

  ↳ **IOperator**

## Implemented by

* [Operator](../classes/operator.md)

## Index

### Properties

* [settings](ioperator.md#settings)

### Methods

* [create](ioperator.md#create)
* [deactivate](ioperator.md#deactivate)
* [identityOwner](ioperator.md#identityowner)
* [read](ioperator.md#read)
* [readAttribute](ioperator.md#readattribute)
* [update](ioperator.md#update)
* [validDelegate](ioperator.md#validdelegate)

## Properties

###  settings

• **settings**: *[IResolverSettings](iresolversettings.md)*

*Inherited from [IResolver](iresolver.md).[settings](iresolver.md#settings)*

*Defined in [did-resolver/src/interface.ts:7](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/interface.ts#L7)*

## Methods

###  create

▸ **create**(): *Promise‹boolean›*

*Defined in [did-resolver/src/interface.ts:65](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/interface.ts#L65)*

Registers a DID-Document for a given DID, and defines the provided context.

**Returns:** *Promise‹boolean›*

___

###  deactivate

▸ **deactivate**(`did`: string): *Promise‹boolean›*

*Defined in [did-resolver/src/interface.ts:91](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/interface.ts#L91)*

Attempts to deactivate the DID Document for a given DID.
Successful, if the transaction is accepted by the smart contract.
Deactivation should be done by the owner of DID.

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹boolean›*

___

###  identityOwner

▸ **identityOwner**(`did`: string): *Promise‹string›*

*Inherited from [IResolver](iresolver.md).[identityOwner](iresolver.md#identityowner)*

*Defined in [did-resolver/src/interface.ts:34](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/interface.ts#L34)*

Returns the current owner for certain DID.
If DID document has not been created, did will be identical to address.
After creation DID owner can be changed.

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹string›*

___

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](ididdocument.md)›*

*Inherited from [IResolver](iresolver.md).[read](iresolver.md#read)*

*Defined in [did-resolver/src/interface.ts:24](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/interface.ts#L24)*

Read method resolves the DID Document for the provided DID.
Should not be confused with “read” method in DID Document Lite,
which returns the required attribute from the DID Document.

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](ididdocument.md)›*

___

###  readAttribute

▸ **readAttribute**(`did`: string, `filter?`: object): *Promise‹[IPublicKey](ipublickey.md) | [IServiceEndpoint](iserviceendpoint.md) | [IAuthentication](iauthentication.md)›*

*Inherited from [IResolver](iresolver.md).[readAttribute](iresolver.md#readattribute)*

*Defined in [did-resolver/src/interface.ts:51](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/interface.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`filter?` | object |

**Returns:** *Promise‹[IPublicKey](ipublickey.md) | [IServiceEndpoint](iserviceendpoint.md) | [IAuthentication](iauthentication.md)›*

___

###  update

▸ **update**(`did`: string, `attribute`: [DIDAttribute](../enums/didattribute.md), `value`: [IUpdateData](iupdatedata.md), `validity`: number | BigNumber): *Promise‹boolean›*

*Defined in [did-resolver/src/interface.ts:76](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/interface.ts#L76)*

Updates relevant attribute of the DID Document.

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

*Defined in [did-resolver/src/interface.ts:45](https://github.com/energywebfoundation/ew-did-registry/blob/c54c7fe/packages/did-resolver/src/interface.ts#L45)*

Checks if the delegate is present for a particular DID.
Returns boolean.

**Parameters:**

Name | Type |
------ | ------ |
`identityDID` | string |
`delegateType` | [DelegateTypes](../enums/delegatetypes.md) |
`delegateDID` | string |

**Returns:** *Promise‹boolean›*
