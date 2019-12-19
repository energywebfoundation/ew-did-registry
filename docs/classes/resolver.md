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

* [read](resolver.md#read)

## Constructors

###  constructor

\+ **new Resolver**(`keys`: IKeys, `settings`: [IResolverSettings](../interfaces/iresolversettings.md)): *[Resolver](resolver.md)*

Defined in did-resolver/src/index.ts:12

**Parameters:**

Name | Type |
------ | ------ |
`keys` | IKeys |
`settings` | [IResolverSettings](../interfaces/iresolversettings.md) |

**Returns:** *[Resolver](resolver.md)*

## Methods

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

*Implementation of [IResolver](../interfaces/iresolver.md)*

Defined in did-resolver/src/index.ts:19

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*
