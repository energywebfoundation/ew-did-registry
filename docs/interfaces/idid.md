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

*Defined in [did/src/interface.ts:27](https://github.com/energywebfoundation/ew-did-registry/blob/4bbd80b/packages/did/src/interface.ts#L27)*

Gets a DID for a particular network

**Parameters:**

Name | Type |
------ | ------ |
`network` | string |

**Returns:** *string | undefined*

___

###  set

▸ **set**(`network`: string, `id`: string): *void*

*Defined in [did/src/interface.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/4bbd80b/packages/did/src/interface.ts#L20)*

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

*Defined in [did/src/interface.ts:12](https://github.com/energywebfoundation/ew-did-registry/blob/4bbd80b/packages/did/src/interface.ts#L12)*

Sets a DID for a particular network (inferred from DID)

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *void*
