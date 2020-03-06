[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Resolver](resolver.md)

# Class: Resolver

To support different networks compliant with ERC1056, the user/developer simply has to provide
different resolver settings. The default resolver settings are provided in the 'constants' folder
Any settings that follow the IResolverSettings interface are valid.

The read functionality is implemented in Resolver class. If one wants to adjust it or create her
own implementation (for example according to ERC725), one could use this class as a
starting point.
All the functionality supporting document resolution is stored in 'functions' folder.

## Hierarchy

* **Resolver**

  ↳ [Operator](operator.md)

## Implements

* [IResolver](../interfaces/iresolver.md)

## Index

### Constructors

* [constructor](resolver.md#constructor)

### Properties

* [settings](resolver.md#settings)

### Methods

* [identityOwner](resolver.md#identityowner)
* [read](resolver.md#read)
* [readAttribute](resolver.md#readattribute)
* [validDelegate](resolver.md#validdelegate)

## Constructors

###  constructor

\+ **new Resolver**(`settings`: [IResolverSettings](../interfaces/iresolversettings.md)): *[Resolver](resolver.md)*

*Defined in [did-resolver/src/implementations/resolver.ts:50](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/did-resolver/src/implementations/resolver.ts#L50)*

Constructor

Settings have to be passed to construct resolver

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`settings` | [IResolverSettings](../interfaces/iresolversettings.md) |   |

**Returns:** *[Resolver](resolver.md)*

## Properties

###  settings

• **settings**: *[IResolverSettings](../interfaces/iresolversettings.md)*

*Implementation of [IResolver](../interfaces/iresolver.md).[settings](../interfaces/iresolver.md#settings)*

*Defined in [did-resolver/src/implementations/resolver.ts:35](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/did-resolver/src/implementations/resolver.ts#L35)*

Stores resolver settings, such as abi, contract address, and IProvider

## Methods

###  identityOwner

▸ **identityOwner**(`did`: string): *Promise‹string›*

*Implementation of [IResolver](../interfaces/iresolver.md)*

*Defined in [did-resolver/src/implementations/resolver.ts:153](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/did-resolver/src/implementations/resolver.ts#L153)*

Returns the Ethereum address of current identity owner

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`did` | string | did of identity of interest |

**Returns:** *Promise‹string›*

Promise<string>

___

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

*Implementation of [IResolver](../interfaces/iresolver.md)*

*Defined in [did-resolver/src/implementations/resolver.ts:136](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/did-resolver/src/implementations/resolver.ts#L136)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

___

###  readAttribute

▸ **readAttribute**(`did`: string, `filter?`: object): *Promise‹[IPublicKey](../interfaces/ipublickey.md) | [IServiceEndpoint](../interfaces/iserviceendpoint.md) | [IAuthentication](../interfaces/iauthentication.md)›*

*Defined in [did-resolver/src/implementations/resolver.ts:140](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/did-resolver/src/implementations/resolver.ts#L140)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |
`filter?` | object |

**Returns:** *Promise‹[IPublicKey](../interfaces/ipublickey.md) | [IServiceEndpoint](../interfaces/iserviceendpoint.md) | [IAuthentication](../interfaces/iauthentication.md)›*

___

###  validDelegate

▸ **validDelegate**(`identityDID`: string, `delegateType`: [DelegateTypes](../enums/delegatetypes.md), `delegateDID`: string): *Promise‹boolean›*

*Implementation of [IResolver](../interfaces/iresolver.md)*

*Defined in [did-resolver/src/implementations/resolver.ts:173](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/did-resolver/src/implementations/resolver.ts#L173)*

Performs the check if the delegate is valid for particular did
Return boolean

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`identityDID` | string | did of identity of interest |
`delegateType` | [DelegateTypes](../enums/delegatetypes.md) | type of delegate of interest |
`delegateDID` | string | - |

**Returns:** *Promise‹boolean›*

Promise<boolean>
