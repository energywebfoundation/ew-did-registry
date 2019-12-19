[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Resolver](resolver.md)

# Class: Resolver

## Hierarchy

* **Resolver**

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

*Defined in [did-resolver/src/index.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/b6dc9ee/packages/did-resolver/src/index.ts#L18)*

Key pair has to be passed on construction to JWT

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`keys` | IKeys | - |   |
`settings` | [IResolverSettings](../interfaces/iresolversettings.md) |  defaultResolverSettings | - |

**Returns:** *[Resolver](resolver.md)*

## Methods

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

*Implementation of [IResolver](../interfaces/iresolver.md)*

*Defined in [did-resolver/src/index.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/b6dc9ee/packages/did-resolver/src/index.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*
