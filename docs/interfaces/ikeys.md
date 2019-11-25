[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IKeys](ikeys.md)

# Interface: IKeys

## Hierarchy

* **IKeys**

## Index

### Properties

* [privateKey](ikeys.md#privatekey)
* [publicKey](ikeys.md#publickey)

### Methods

* [sign](ikeys.md#sign)
* [verify](ikeys.md#verify)

## Properties

###  privateKey

• **privateKey**: *string*

*Defined in [keys/src/interface.ts:5](https://github.com/energywebfoundation/ew-did-registry/blob/f033610/packages/keys/src/interface.ts#L5)*

Private key in hex format

___

###  publicKey

• **publicKey**: *string*

*Defined in [keys/src/interface.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/f033610/packages/keys/src/interface.ts#L10)*

Public key in hex format

## Methods

###  sign

▸ **sign**(`data`: string, `privateKey?`: string): *string*

*Defined in [keys/src/interface.ts:18](https://github.com/energywebfoundation/ew-did-registry/blob/f033610/packages/keys/src/interface.ts#L18)*

Sign the data with private key

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`privateKey?` | string |

**Returns:** *string*

___

###  verify

▸ **verify**(`data`: string, `signature`: string, `publicKey?`: string): *boolean*

*Defined in [keys/src/interface.ts:27](https://github.com/energywebfoundation/ew-did-registry/blob/f033610/packages/keys/src/interface.ts#L27)*

Verify the signature accordance to data with public key

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`signature` | string |
`publicKey?` | string |

**Returns:** *boolean*
