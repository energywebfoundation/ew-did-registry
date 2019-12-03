[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDID](idid.md)

# Interface: IDID

## Hierarchy

* **IDID**

## Index

### Methods

* [get](idid.md#get)
* [set](idid.md#set)

## Methods

###  get

▸ **get**(`network`: [Networks](../enums/networks.md)): *string | undefined*

*Defined in [did/src/interface.ts:30](https://github.com/energywebfoundation/ew-did-registry/blob/5fca7cf/packages/did/src/interface.ts#L30)*

Gets a DID for a particular network

**Parameters:**

Name | Type |
------ | ------ |
`network` | [Networks](../enums/networks.md) |

**Returns:** *string | undefined*

___

###  set

▸ **set**(`did`: string): *void*

*Defined in [did/src/interface.ts:14](https://github.com/energywebfoundation/ew-did-registry/blob/5fca7cf/packages/did/src/interface.ts#L14)*

Sets a DID for a particular network (inferred from DID provided)

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *void*

▸ **set**(`network`: [Networks](../enums/networks.md), `id`: string): *void*

*Defined in [did/src/interface.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/5fca7cf/packages/did/src/interface.ts#L22)*

Sets a DID for the provided network

**Parameters:**

Name | Type |
------ | ------ |
`network` | [Networks](../enums/networks.md) |
`id` | string |

**Returns:** *void*
