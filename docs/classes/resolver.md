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

### Methods

* [identityOwner](resolver.md#identityowner)
* [read](resolver.md#read)
* [validDelegate](resolver.md#validdelegate)

## Constructors

###  constructor

\+ **new Resolver**(`settings`: [IResolverSettings](../interfaces/iresolversettings.md)): *[Resolver](resolver.md)*

*Defined in [did-resolver/src/implementations/resolver.ts:44](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/implementations/resolver.ts#L44)*

Constructor

Settings have to be passed to construct resolver

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`settings` | [IResolverSettings](../interfaces/iresolversettings.md) |  defaultResolverSettings |   |

**Returns:** *[Resolver](resolver.md)*

## Methods

###  identityOwner

▸ **identityOwner**(`did`: string): *Promise‹string›*

*Implementation of [IResolver](../interfaces/iresolver.md)*

*Defined in [did-resolver/src/implementations/resolver.ts:131](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/implementations/resolver.ts#L131)*

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

*Defined in [did-resolver/src/implementations/resolver.ts:83](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/implementations/resolver.ts#L83)*

Resolve DID Document for a given did

**`example`** 
```typescript
import { Resolver } from '@ew-did-registry/did-resolver';

const resolver = new Resolver();
const didDocument = await resolver.read(did);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`did` | string | entity identifier, which is associated with DID Document |

**Returns:** *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

___

###  validDelegate

▸ **validDelegate**(`identityDID`: string, `delegateType`: [DelegateTypes](../enums/delegatetypes.md), `delegateDID`: string): *Promise‹boolean›*

*Implementation of [IResolver](../interfaces/iresolver.md)*

*Defined in [did-resolver/src/implementations/resolver.ts:151](https://github.com/energywebfoundation/ew-did-registry/blob/9796cd6/packages/did-resolver/src/implementations/resolver.ts#L151)*

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
