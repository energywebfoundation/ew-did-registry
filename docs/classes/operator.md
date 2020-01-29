[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [Operator](operator.md)

# Class: Operator

To support/extend this Class, one just has to work with this file.
All the supporting functions are stored as private methods (i.e. with the '_' symbol)
One can easily extend the methods available by researching the smart contract functionality,
as well as by understanding how the read is performed.

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

*Defined in [did-resolver/src/implementations/operator.ts:47](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/operator.ts#L47)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`keys` | IKeys | - | identifies an account which acts as a controller in a subsequent operations with DID document  |
`settings` | [IResolverSettings](../interfaces/iresolversettings.md) |  defaultResolverSettings | - |

**Returns:** *[Operator](operator.md)*

## Methods

###  changeOwner

▸ **changeOwner**(`identityDID`: string, `newOwnerDid`: string): *Promise‹boolean›*

*Defined in [did-resolver/src/implementations/operator.ts:218](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/operator.ts#L218)*

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

*Defined in [did-resolver/src/implementations/operator.ts:76](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/operator.ts#L76)*

Relevant did should have positive cryptocurrency balance to perform
the transaction. Create method saves the public key in smart contract's
event, which can be qualified as document creation

**Returns:** *Promise‹boolean›*

Promise<boolean>

___

###  deactivate

▸ **deactivate**(`did`: string): *Promise‹boolean›*

*Implementation of [IOperator](../interfaces/ioperator.md)*

*Defined in [did-resolver/src/implementations/operator.ts:257](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/operator.ts#L257)*

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

*Defined in [did-resolver/src/implementations/resolver.ts:131](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/resolver.ts#L131)*

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

*Defined in [did-resolver/src/implementations/resolver.ts:83](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/resolver.ts#L83)*

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

*Defined in [did-resolver/src/implementations/operator.ts:184](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/operator.ts#L184)*

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

*Defined in [did-resolver/src/implementations/operator.ts:149](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/operator.ts#L149)*

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

*Defined in [did-resolver/src/implementations/operator.ts:124](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/operator.ts#L124)*

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

*Defined in [did-resolver/src/implementations/resolver.ts:151](https://github.com/energywebfoundation/ew-did-registry/blob/bf1f4a6/packages/did-resolver/src/implementations/resolver.ts#L151)*

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
