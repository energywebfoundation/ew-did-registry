[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [DID](did.md)

# Class: DID

## Hierarchy

* **DID**

## Implements

* [IDID](../interfaces/idid.md)

## Index

### Methods

* [get](did.md#get)
* [set](did.md#set)

## Methods

###  get

▸ **get**(`network`: [Networks](../enums/networks.md)): *string | undefined*

*Defined in [did/src/index.ts:31](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did/src/index.ts#L31)*

Gets a DID for a particular network

**`example`** 
```typescript
import { DID, Network } from '@ew-did-registry/did';

const did = new DID();
did.set('bitcoin', 'method_specific_id');
console.log(did.get('bitcoin')); // 'did:bitcoin:method_specific_id'

const did = new DID();
did.set(Networks.Ethereum, 'method_specific_id');
console.log(did.get(Networks.Ethereum)); // 'did:eth:method_specific_id'
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`network` | [Networks](../enums/networks.md) |   |

**Returns:** *string | undefined*

___

###  set

▸ **set**(`did`: string): *[IDID](../interfaces/idid.md)*

*Implementation of [IDID](../interfaces/idid.md)*

*Defined in [did/src/index.ts:51](https://github.com/energywebfoundation/ew-did-registry/blob/beea45f/packages/did/src/index.ts#L51)*

Sets a DID for a particular network (inferred from DID provided)

**`example`** 
```typescript
import { DID } from '@ew-did-registry/did';

const did = new DID();
did.set('did:eth:method_specific_id');
console.log(did.get('eth')); // 'did:eth:method_specific_id'
```

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`did` | string |   |

**Returns:** *[IDID](../interfaces/idid.md)*
