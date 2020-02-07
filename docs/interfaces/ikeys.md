[@ew-did-registry/claims - v1.0.0](../README.md) › [Globals](../globals.md) › [IKeys](ikeys.md)

# Interface: IKeys

## Hierarchy

* **IKeys**

## Implemented by

* [Keys](../classes/keys.md)

## Index

### Properties

* [address](ikeys.md#address)
* [privateKey](ikeys.md#privatekey)
* [publicKey](ikeys.md#publickey)

### Methods

* [decrypt](ikeys.md#decrypt)
* [encrypt](ikeys.md#encrypt)
* [sign](ikeys.md#sign)
* [verify](ikeys.md#verify)

## Properties

###  address

• **address**: *string*

*Defined in [keys/src/interface.ts:12](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/keys/src/interface.ts#L12)*

___

###  privateKey

• **privateKey**: *string*

*Defined in [keys/src/interface.ts:5](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/keys/src/interface.ts#L5)*

Private key in hex format

___

###  publicKey

• **publicKey**: *string*

*Defined in [keys/src/interface.ts:10](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/keys/src/interface.ts#L10)*

Public key in hex format

## Methods

###  decrypt

▸ **decrypt**(`encrypted`: string, `publicKeyTo?`: string): *Promise‹string›*

*Defined in [keys/src/interface.ts:45](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/keys/src/interface.ts#L45)*

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

*Defined in [keys/src/interface.ts:37](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/keys/src/interface.ts#L37)*

Encryption

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`publicKeyTo?` | string |

**Returns:** *Promise‹string›*

___

###  sign

▸ **sign**(`data`: string, `privateKey?`: string): *string*

*Defined in [keys/src/interface.ts:20](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/keys/src/interface.ts#L20)*

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

*Defined in [keys/src/interface.ts:29](https://github.com/energywebfoundation/ew-did-registry/blob/d64ff0f/packages/keys/src/interface.ts#L29)*

Verify the signature accordance to data with public key

**Parameters:**

Name | Type |
------ | ------ |
`data` | string |
`signature` | string |
`publicKey?` | string |

**Returns:** *boolean*
