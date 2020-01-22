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

* [changeOwner](operator.md#changeowner)
* [create](operator.md#create)
* [deactivate](operator.md#deactivate)
* [identityOwner](operator.md#identityowner)
* [read](operator.md#read)
* [revokeAttribute](operator.md#revokeattribute)
* [revokeDelegate](operator.md#revokedelegate)
* [update](operator.md#update)
* [validDelegate](operator.md#validdelegate)

## Constructors

###  constructor

\+ **new Operator**(`keys`: IKeys, `settings`: [IResolverSettings](../interfaces/iresolversettings.md)): *[Operator](operator.md)*

*Overrides [Resolver](resolver.md).[constructor](resolver.md#constructor)*

*Defined in [did-resolver/src/implementations/operator.ts:41](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/operator.ts#L41)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`keys` | IKeys | - | identifies an account which acts as a controller in a subsequent operations with DID document  |
`settings` | [IResolverSettings](../interfaces/iresolversettings.md) |  defaultResolverSettings | - |

**Returns:** *[Operator](operator.md)*

## Methods

###  changeOwner

▸ **changeOwner**(`identityDID`: string, `newOwnerDid`: string): *Promise‹boolean›*

*Defined in [did-resolver/src/implementations/operator.ts:211](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/operator.ts#L211)*

Changes the owner of particular decentralised identity
Returns true on success

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`identityDID` | string | did of current identity owner |
`newOwnerDid` | string | did of new owner that will be set on success |

**Returns:** *Promise‹boolean›*

Promise<boolean>

___

###  create

▸ **create**(): *Promise‹boolean›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

*Defined in [did-resolver/src/implementations/operator.ts:69](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/operator.ts#L69)*

Empty for this implementation

**Returns:** *Promise‹boolean›*

Promise<boolean>

___

###  deactivate

▸ **deactivate**(`did`: string): *Promise‹boolean›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

*Defined in [did-resolver/src/implementations/operator.ts:250](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/operator.ts#L250)*

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

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *Promise‹boolean›*

Promise<boolean>

___

###  identityOwner

▸ **identityOwner**(`did`: string): *Promise‹string›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

*Inherited from [Resolver](resolver.md).[identityOwner](resolver.md#identityowner)*

*Defined in [did-resolver/src/implementations/resolver.ts:121](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/resolver.ts#L121)*

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

*Implementation of [IOperator](../interfaces/ioperator.md)*

*Inherited from [Resolver](resolver.md).[read](resolver.md#read)*

*Defined in [did-resolver/src/implementations/resolver.ts:73](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/resolver.ts#L73)*

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

###  revokeAttribute

▸ **revokeAttribute**(`identityDID`: string, `attributeType`: [DIDAttribute](../enums/didattribute.md), `updateData`: [IUpdateData](../interfaces/iupdatedata.md)): *Promise‹boolean›*

*Defined in [did-resolver/src/implementations/operator.ts:177](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/operator.ts#L177)*

Revokes the attribute from DID Document
Returns true on success

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`identityDID` | string | did of identity of interest |
`attributeType` | [DIDAttribute](../enums/didattribute.md) | type of attribute to revoke |
`updateData` | [IUpdateData](../interfaces/iupdatedata.md) | data required to identify the correct attribute to revoke |

**Returns:** *Promise‹boolean›*

Promise<boolean>

___

###  revokeDelegate

▸ **revokeDelegate**(`identityDID`: string, `delegateType`: [PubKeyType](../enums/pubkeytype.md), `delegateDID`: string): *Promise‹boolean›*

*Defined in [did-resolver/src/implementations/operator.ts:142](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/operator.ts#L142)*

Revokes the delegate from DID Document
Returns true on success

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`identityDID` | string | did of identity of interest |
`delegateType` | [PubKeyType](../enums/pubkeytype.md) | type of delegate of interest |
`delegateDID` | string | did of delegate of interest |

**Returns:** *Promise‹boolean›*

Promise<boolean>

___

###  update

▸ **update**(`did`: string, `didAttribute`: [DIDAttribute](../enums/didattribute.md), `updateData`: [IUpdateData](../interfaces/iupdatedata.md), `validity`: number): *Promise‹boolean›*

*Defined in [did-resolver/src/implementations/operator.ts:117](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/operator.ts#L117)*

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
`validity` | number |  Number.MAX_SAFE_INTEGER | time in milliseconds during which                              attribute will be valid |

**Returns:** *Promise‹boolean›*

Promise<boolean>

___

###  validDelegate

▸ **validDelegate**(`identityDID`: string, `delegateType`: [DelegateTypes](../enums/delegatetypes.md), `delegateDID`: string): *Promise‹boolean›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

*Inherited from [Resolver](resolver.md).[validDelegate](resolver.md#validdelegate)*

*Defined in [did-resolver/src/implementations/resolver.ts:141](https://github.com/energywebfoundation/ew-did-registry/blob/44f0f6f/packages/did-resolver/src/implementations/resolver.ts#L141)*

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
