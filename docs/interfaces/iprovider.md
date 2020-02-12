[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IProvider](iprovider.md)

# Interface: IProvider

Specifies Provider to be used to communicate with blockchain.
The uri, path, and network are the parameters found in the ethers library.
Hence, 'ethers' documentation is a good point to check the available options,
if one wants to extend the library.

## Hierarchy

* **IProvider**

## Index

### Properties

* [network](iprovider.md#optional-network)
* [path](iprovider.md#optional-path)
* [type](iprovider.md#type)
* [uriOrInfo](iprovider.md#optional-uriorinfo)

## Properties

### `Optional` network

• **network**? : *utils.Networkish*

*Defined in [did-resolver/src/models/resolver.ts:22](https://github.com/energywebfoundation/ew-did-registry/blob/f6d3180/packages/did-resolver/src/models/resolver.ts#L22)*

___

### `Optional` path

• **path**? : *string*

*Defined in [did-resolver/src/models/resolver.ts:21](https://github.com/energywebfoundation/ew-did-registry/blob/f6d3180/packages/did-resolver/src/models/resolver.ts#L21)*

___

###  type

• **type**: *[ProviderTypes](../enums/providertypes.md)*

*Defined in [did-resolver/src/models/resolver.ts:19](https://github.com/energywebfoundation/ew-did-registry/blob/f6d3180/packages/did-resolver/src/models/resolver.ts#L19)*

___

### `Optional` uriOrInfo

• **uriOrInfo**? : *string | utils.ConnectionInfo*

*Defined in [did-resolver/src/models/resolver.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/f6d3180/packages/did-resolver/src/models/resolver.ts#L20)*
