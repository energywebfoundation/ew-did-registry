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

\+ **new Operator**(`keys`: IKeys): *[Operator](operator.md)*

*Overrides [Resolver](resolver.md).[constructor](resolver.md#constructor)*

Defined in did-resolver/src/implementations/operator.ts:40

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`keys` | IKeys | identifies an account which acts as a controller in a subsequent operations with DID document  |

**Returns:** *[Operator](operator.md)*

## Methods

###  create

▸ **create**(`did`: string, `context`: string): *Promise‹boolean›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

Defined in did-resolver/src/implementations/operator.ts:66

Empty for this implementation

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

Defined in did-resolver/src/implementations/operator.ts:130

Revokes authentication methods, public keys and delegates from DID document

**`example`** 
```typescript
import { Operator } from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';

const ownerKeys = new Keys();
const operator = new Operator(ownerKeys);
const updated = await operator.deactivate(did);
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

Defined in did-resolver/src/implementations/resolver.ts:29

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹[IDIDDocument](../interfaces/ididdocument.md)›*

___

###  update

▸ **update**(`did`: string, `didAttribute`: [DIDAttribute](../enums/didattribute.md), `updateData`: [IUpdateData](../interfaces/iupdatedata.md), `validity`: number | BigNumber): *Promise‹boolean›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

Defined in did-resolver/src/implementations/operator.ts:102

Sets attribute value in DID document identified by the did

**`example`** 
```typescript
import {
Operator, DIDAttribute, Algorithms, PubKeyType, Encoding
 } from '@ew-did-registry/did-resolver';
import { Keys } from '@ew-did-registry/keys';

const ownerKeys = new Keys();
const operator = new Operator(ownerKeys);
const pKey = DIDAttribute.PublicKey;
const updateData = {
    algo: Algorithms.ED25519,
    type: PubKeyType.VerificationKey2018,
    encoding: Encoding.HEX,
    value: new Keys().publicKey,
};
const validity = 10 * 60 * 1000;
const updated = await operator.update(did, pKey, updateData, validity);
```

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`did` | string | - | did associated with DID document |
`didAttribute` | [DIDAttribute](../enums/didattribute.md) | - | specifies updated section in DID document. Must be 31 bytes or shorter |
`updateData` | [IUpdateData](../interfaces/iupdatedata.md) | - | - |
`validity` | number &#124; BigNumber |  ethers.constants.MaxUint256 | time in milliseconds during which                              attribute will be valid  |

**Returns:** *Promise‹boolean›*

Promise<boolean>
