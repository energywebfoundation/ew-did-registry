[@ew-did-registry/did](../README.md) › [Globals](../globals.md) › [Resolver](resolver.md)

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

\+ **new Resolver**(`settings`: [IResolverSettings](../interfaces/iresolversettings.md)): *[Resolver](resolver.md)*

Defined in did-resolver/src/models/resolver.ts:127

Constructor

Settings have to be passed to construct resolver

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`settings` | [IResolverSettings](../interfaces/iresolversettings.md) |  defaultResolverSettings |   |

**Returns:** *[Resolver](resolver.md)*

## Methods

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

*Implementation of [IResolver](../interfaces/iresolver.md)*

Defined in did-resolver/src/models/resolver.ts:139

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*
