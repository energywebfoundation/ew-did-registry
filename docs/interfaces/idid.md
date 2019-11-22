[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDID](idid.md)

# Interface: IDID

## Hierarchy

* **IDID**

## Index

### Methods

* [get](idid.md#get)
* [set](idid.md#set)
* [setDid](idid.md#setdid)

## Methods

###  get

▸ **get**(`network`: string): *string | undefined*

*Defined in [did/src/interface.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/9712f46/packages/did/src/interface.ts#L29)*

Gets a DID for a particular network

**Parameters:**

Name | Type |
------ | ------ |
`network` | string |

**Returns:** *string | undefined*

___

###  set

▸ **set**(`network`: string, `id`: string): *void*

*Defined in [did/src/interface.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/9712f46/packages/did/src/interface.ts#L22)*

Sets a DID for the provided network

**Parameters:**

Name | Type |
------ | ------ |
`network` | string |
`id` | string |

**Returns:** *void*

___

###  setDid

▸ **setDid**(`did`: string): *void*

*Defined in [did/src/interface.ts:14](https://github.com/energywebfoundation/ew-did-registry/blob/9712f46/packages/did/src/interface.ts#L14)*

Sets a DID for a particular network (inferred from DID)

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *void*
