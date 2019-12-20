[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [Operator](operator.md)

# Class: Operator

## Hierarchy

* [Resolver](resolver.md)

  ↳ **Operator**

## Implements

* [IResolver](../interfaces/iresolver.md)
* [IOperator](../interfaces/ioperator.md)

## Index

### Constructors

* [constructor](operator.md#constructor)

### Methods

* [create](operator.md#create)
* [deactivate](operator.md#deactivate)
* [read](operator.md#read)
* [update](operator.md#update)

## Constructors

###  constructor

\+ **new Operator**(`keys`: IKeys, `settings?`: [IResolverSettings](../interfaces/iresolversettings.md)): *[Operator](operator.md)*

*Overrides [Resolver](resolver.md).[constructor](resolver.md#constructor)*

Defined in did-resolver/src/models/operator.ts:20

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keys` | IKeys | identifies an account which acts as a controller in a subsequent operations with DID document |
`settings?` | [IResolverSettings](../interfaces/iresolversettings.md) | - |

**Returns:** *[Operator](operator.md)*

## Methods

###  create

▸ **create**(`did`: string, `context`: string): *Promise‹boolean›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

Defined in did-resolver/src/models/operator.ts:46

Empty for current implementation

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`did` | string | - |
`context` | string |   |

**Returns:** *Promise‹boolean›*

___

###  deactivate

▸ **deactivate**(`did`: string): *Promise‹boolean›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

Defined in did-resolver/src/models/operator.ts:73

Revokes specified attribute from DID document

**`example`** 
```typescript
import { Operator, ProviderTypes } from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';

const keys = new Keys();
const resolverSettings = {
abi, // abi of the ERC1056 compliant smart-contract
address, // ethereum address of the smart-contract
  provider: {
    uri: 'https://volta-rpc.energyweb.org/',
    type: ProviderTypes.HTTP,
  }
};
const operator = new Operator(keys, resolverSettings);
const updated = operator.deactivate(did);
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`did` | string |   |

**Returns:** *Promise‹boolean›*

___

###  read

▸ **read**(`did`: string): *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

*Inherited from [Resolver](resolver.md).[read](resolver.md#read)*

Defined in did-resolver/src/models/resolver.ts:22

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

___

###  update

▸ **update**(`did`: string, `attribute`: string, `value`: string | object, `validity?`: number): *Promise‹boolean›*

Defined in did-resolver/src/models/operator.ts:125

Sets attribute value in Did document identified by the did

**`example`** 
```typescript
import { Operator, ProviderTypes } from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';

const keys = new Keys();
const resolverSettings = {
abi, // abi of the ERC1056 compliant smart-contract
address, // ethereum address of the smart-contract
  provider: {
    uri: 'https://volta-rpc.energyweb.org/',
    type: ProviderTypes.HTTP,
  }
};
const operator = new Operator(keys, resolverSettings);
const updated = operator.update(did, Attributes.service, "DrivingLicense");
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`did` | string | did associated with DID document |
`attribute` | string | attribute name. Must be 31 bytes or shorter |
`value` | string &#124; object | attribute value |
`validity?` | number | time in milliseconds during which                              attribute will be valid  |

**Returns:** *Promise‹boolean›*

Promise<boolean>
