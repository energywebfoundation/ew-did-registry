[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [DID](did.md)

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

*Implementation of [IDID](../interfaces/idid.md)*

Defined in did/src/index.ts:33

Gets a DID for a particular network

**`example`** 
```typescript
import { DID } from '@ew-did-registry/did';

const did = new DID();
did.set('eth', 'method_specific_id');
console.log(did.get('eth')); // 'did:eth:method_specific_id'
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

Defined in did/src/index.ts:56

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
