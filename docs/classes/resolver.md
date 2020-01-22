[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Resolver](resolver.md)

# Class: Resolver

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

Defined in did-resolver/src/implementations/resolver.ts:34

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

Defined in did-resolver/src/implementations/resolver.ts:120

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

Defined in did-resolver/src/implementations/resolver.ts:73

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

Defined in did-resolver/src/implementations/resolver.ts:140

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
