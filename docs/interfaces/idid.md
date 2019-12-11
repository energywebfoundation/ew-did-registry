[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IDID](idid.md)

# Interface: IDID

## Hierarchy

* **IDID**

## Implemented by

* [DID](../classes/did.md)

## Index

### Methods

* [get](idid.md#get)
* [set](idid.md#set)

## Methods

###  get

▸ **get**(`network`: [Networks](../enums/networks.md)): *string | undefined*

Defined in did/src/interface.ts:30

Gets a DID for a particular network

**Parameters:**

Name | Type |
------ | ------ |
`network` | [Networks](../enums/networks.md) |

**Returns:** *string | undefined*

___

###  set

▸ **set**(`did`: string): *[IDID](idid.md)*

Defined in did/src/interface.ts:14

Sets a DID for a particular network (inferred from DID provided)

**Parameters:**

Name | Type |
------ | ------ |
`did` | string |

**Returns:** *[IDID](idid.md)*

▸ **set**(`network`: [Networks](../enums/networks.md), `id`: string): *[IDID](idid.md)*

Defined in did/src/interface.ts:22

Sets a DID for the provided network

**Parameters:**

Name | Type |
------ | ------ |
`network` | [Networks](../enums/networks.md) |
`id` | string |

**Returns:** *[IDID](idid.md)*
