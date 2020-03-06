[@ew-did-registry/claims](../README.md) › [Globals](../globals.md) › [IKeys](ikeys.md)

# Interface: IKeys

## Hierarchy

* **IKeys**

## Implemented by

* [Keys](../classes/keys.md)

## Index

### Properties

* [privateKey](ikeys.md#privatekey)
* [publicKey](ikeys.md#publickey)

### Methods

* [decrypt](ikeys.md#decrypt)
* [encrypt](ikeys.md#encrypt)
* [getAddress](ikeys.md#getaddress)
* [sign](ikeys.md#sign)
* [verify](ikeys.md#verify)

## Properties

###  privateKey

• **privateKey**: *string*

*Defined in [keys/src/interface.ts:5](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/keys/src/interface.ts#L5)*

Private key in hex format

___

###  publicKey

• **publicKey**: *string*

*Defined in [keys/src/interface.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/keys/src/interface.ts#L10)*

Public key in hex format

## Methods

###  decrypt

▸ **decrypt**(`encrypted`: string, `publicKeyTo?`: string): *Promise‹string›*

*Defined in [keys/src/interface.ts:48](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/keys/src/interface.ts#L48)*

Decryption

**Parameters:**

Name | Type |
------ | ------ |
`encrypted` | string |
`publicKeyTo?` | string |

**Returns:** *Promise‹string›*

___

###  encrypt

▸ **encrypt**(`data`: string, `publicKeyTo?`: string): *Promise‹string›*

*Defined in [keys/src/interface.ts:40](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/keys/src/interface.ts#L40)*

Encryption

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`publicKeyTo?` | string |

**Returns:** *Promise‹string›*

___

###  getAddress

▸ **getAddress**(): *string*

*Defined in [keys/src/interface.ts:15](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/keys/src/interface.ts#L15)*

Returns Ethereum address of the corresponding keypair

**Returns:** *string*

___

###  sign

▸ **sign**(`data`: string, `privateKey?`: string): *string*

*Defined in [keys/src/interface.ts:23](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/keys/src/interface.ts#L23)*

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

*Defined in [keys/src/interface.ts:32](https://github.com/energywebfoundation/ew-did-registry/blob/b2aa9a8/packages/keys/src/interface.ts#L32)*

Verify the signature accordance to data with public key

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`signature` | string |
`publicKey?` | string |

**Returns:** *boolean*
